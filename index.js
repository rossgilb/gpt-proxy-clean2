const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🧠 Ross Trivia Bank
const rossFacts = [
  "Ross ran a 32-mile ultramarathon.",
  "Ross built this chatbot inside Salesforce with LWC and Apex.",
  "Ross lives in Phoenix.",
  "Ross has 2 sons, Jack and Luke.",
  "Ross has a beautiful wife who is smarter than him named Marybeth.",
  "Ross's princess is his dog Holly."
];

function getRandomRossFact() {
  return rossFacts[Math.floor(Math.random() * rossFacts.length)];
}

app.post('/chat', async (req, res) => {
  const messages = req.body.messages || [];

  // 🔍 Extract the most recent user message (for keyword matching)
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || '';

  // 🎉 Ross Easter Egg
  if (
    lastUserMessage.includes("who is ross") ||
    lastUserMessage.includes("ross gilbert") ||
    lastUserMessage.includes("who built this")
  ) {
    return res.send({
      response: `Ross Gilbert is the genius behind this assistant. He's a Salesforce wizard, a builder of cool stuff, and a kind of quiet legend. He even built this very chatbot you're talking to! 🤖`
    });
  }

  // 🎲 Ross Trivia Trigger
  if (
    lastUserMessage.includes("tell me about ross") ||
    lastUserMessage.includes("fun fact about ross") ||
    lastUserMessage.includes("ross trivia") ||
    lastUserMessage.includes("ross fact") ||
    lastUserMessage.includes("trivia about ross")
  ) {
    return res.send({
      response: getRandomRossFact()
    });
  }

  // 🔁 Normal GPT prompt handling with memory
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.2
    }, {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.send({ response: reply });
  } catch (error) {
    console.error('GPT error:', error.response?.data || error.message);
    res.status(500).send({ error: 'Failed to contact GPT' });
  }
});

app.listen(PORT, () => {
  console.log(`GPT proxy running on http://localhost:${PORT}`);
});
//test