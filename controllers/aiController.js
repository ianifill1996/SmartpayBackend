const axios = require('axios');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();


// OpenAI SDK setup
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

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

  try {
    const prompt = `Extract the following from this receipt text:
- Total amount spent
- Payment method (cash, card, credit, etc)
- Purchase category (like food, transport, clothing)

Format the result as a JSON object like:
{ "amount": 12.99, "method": "card", "category": "food" }

Receipt text:
""" 
${rawText}
"""`;

    const { data } = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const content = data.choices[0].message.content.trim();

    let result;
    try {
      result = JSON.parse(content);
    } catch (err) {
      return res.status(422).json({ message: "Could not parse AI response", raw: content });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI receipt parsing failed" });
  }
};
