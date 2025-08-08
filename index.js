// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Verificación del webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes de Facebook
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const userMessage = webhookEvent.message.text.toLowerCase();
        let aiResponse = await getAIResponse(userMessage);

        // Eliminar líneas que contienen saludos automáticos comunes
        const saludoRegex = /^(hola|buenas|¡hola!|¿en qué puedo ayudarte.*|¿cómo puedo ayudarte.*)/i;
        aiResponse = aiResponse
          .split('\n')
          .filter(line => !saludoRegex.test(line.trim()))
          .join('\n')
          .trim();

        let finalResponse = aiResponse;

        if (/\b(hola|buenas|consulta|ayuda|información|info|asesoría|cotización)\b/.test(userMessage)) {
          const greeting = 'Hola, soy Armando, el asistente virtual de SIP TERMO HOME. Explícame brevemente en qué te puedo ayudar.';
          finalResponse = `${greeting}\n\n${aiResponse}`;
        }

        await sendMessage(senderPsid, finalResponse);
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Función para enviar mensajes a través de la API de Facebook
async function sendMessage(senderPsid, response) {
  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    recipient: { id: senderPsid },
    message: { text: response },
  };

  try {
    await axios.post(url, payload);
  } catch (error) {
    console.error('Error al enviar mensaje a Facebook:', JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

// Función para obtener respuesta de OpenAI
async function getAIResponse(message) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres Armando, el asistente virtual de SIP TERMO HOME. Bajo ninguna circunstancia debes decir que eres una inteligencia artificial, ni mencionar OpenAI, ni que eres un modelo de lenguaje. Siempre debes responder como Armando. Solo puedes hablar sobre los productos y servicios que ofrece SIP TERMO HOME. SIP TERMO HOME fabrica paneles SIP con certificación estructural, ofrece kits de autoconstrucción con aire acondicionado de regalo, realiza cortes CNC, asesora en cálculos térmicos y vende materiales en su ferretería ubicada en Los Gladiolos 455, Pueblo Seco, región de Ñuble. El número de contacto es +56961228046. Si alguien pregunta por tu identidad, solo di: “Soy Armando, el asistente virtual de SIP TERMO HOME”. No saludes con frases como “Hola” o “¿En qué puedo ayudarte hoy?”. Solo responde con información clara y precisa.`
          },
          {
            role: 'user',
            content: `Usuario pregunta: "${message}". Recuerda que SIP TERMO HOME fabrica y comercializa paneles SIP, kits de autoconstrucción, realiza cortes CNC, tiene ferretería y asesora en transmitancia térmica.`
          }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al obtener respuesta de OpenAI:', JSON.stringify(error.response?.data || error.message, null, 2));
    return 'Lo siento, hubo un error al procesar tu mensaje.';
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
