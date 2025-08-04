import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI  from 'openai';

dotenv.config();

// OpenAI SDK setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Detect payment reason and category from description
// @route   POST /api/ai/intent
// @access  Private
export const detectPaymentIntent = async (req, res) => {
  console.log("REQ.BODY:", req.body);

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required in request body.' });
  }

  try {
    const prompt = `Analyze this payment description: "${message}"
Return a JSON object like:
{
  "reason": "What the payment was likely for",
  "category": "General category (e.g., food, rent, shopping, transportation, etc.)"
}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    console.log("AI Reply:", reply);

    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch (err) {
      return res.status(422).json({
        message: 'AI response is not valid JSON',
        raw: reply,
      });
    }

    if (!parsed.reason || !parsed.category) {
      return res.status(422).json({
        message: 'AI response missing required fields.',
        parsed,
      });
    }

    res.status(200).json({ 
      reason: parsed.reason,
      category: parsed.category,
    });

  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI failed to parse payment intent.' });
  }
};

// @desc    Parse raw receipt text to extract structured info
// @route   POST /api/ai/parse-receipt
// @access  Private
export const parseReceiptAI = async (req, res) => {
  const { rawText } = req.body;

  if (!rawText) {
    return res.status(400).json({ message: "No receipt text provided" });
  }

  const prompt = `
You are an AI receipt parser.

Extract the following fields from the raw receipt text below:
- store_name
- date
- amount (total spent)
- tax (if available)
- payment_method (cash, card, credit, etc)
- card_last4 (if available)
- items: list of { name, quantity (if present), price }

Return the result as a JSON object. If a field is not found, use null.

Example input:
"Target
Date: 06/15/2024
Items:
Milk - $3.49
Eggs - $2.99
Total: $6.48
Paid with Visa **** 1234"

Should return:
{
  "store_name": "Target",
  "date": "2024-06-15",
  "amount": 6.48,
  "tax": null,
  "payment_method": "Visa",
  "card_last4": "1234",
  "items": [
    { "name": "Milk", "quantity": 1, "price": 3.49 },
    { "name": "Eggs", "quantity": 1, "price": 2.99 }
  ]
}

Now extract from this receipt:
""" 
${rawText}
"""`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    console.log("AI raw reply:", reply);

    const parsed = JSON.parse(reply);
    res.status(200).json(parsed);
  } catch (err) {
    console.error("AI receipt parse error:", err.response?.data || err.message, err.stack);
    res.status(500).json({ message: "AI receipt parsing failed" });
  }
};