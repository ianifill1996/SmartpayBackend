import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const detectPaymentIntent = async (req, res) => {
  console.log("REQ.BODY:", req.body); // Add this at the top

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required in request body.' });
  }

  try {
    const prompt = `Extract a JSON object with "reason" and "category" from this payment description: "${message}"`;

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
    console.log("AI Reply:", reply); // See raw AI response

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
      reason: parsed.reaos,
      category: parsed.category
     });

  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI failed to parse payment intent.' });
  }
};