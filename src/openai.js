const axios = require('axios');

async function askChatGPT(message) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('Error con OpenAI:', err.response?.data || err.message);
    return "Lo siento, hubo un error al consultar ChatGPT.";
  }
}

module.exports = { askChatGPT };
