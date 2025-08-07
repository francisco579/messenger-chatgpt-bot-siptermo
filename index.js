require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messenger = require('./src/messenger');
const openai = require('./src/openai');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Webhook de verificación para Messenger
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error de verificación');
  }
});

// Manejo de mensajes recibidos
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(async (entry) => {
      const event = entry.messaging[0];
      const senderId = event.sender.id;
      if (event.message && event.message.text) {
        const userMessage = event.message.text;
        // Obtiene respuesta de ChatGPT
        const chatResponse = await openai.askChatGPT(userMessage);
        // Envía respuesta a Messenger
        await messenger.sendMessage(senderId, chatResponse);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Bot ejecutándose en el puerto ${PORT}`);
});
