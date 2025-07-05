const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/categorize', async (req, res) => {
  const { description } = req.body;

  if (!description) return res.status(400).json({ error: 'Missing description' });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Categorize this transaction based on the description. Choose from: Groceries, Dining, Rent, Utilities, Subscriptions, Medical, Transportation, Entertainment, Pets, Travel, Income, Debt Payment, Other.',
          },
          {
            role: 'user',
            content: `Description: "${description}"`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const category = response.data.choices[0].message.content.trim();
    res.json({ category });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI Categorizer running on port ${port}`));
