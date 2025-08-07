const axios = require('axios');

const sendMessage = async (recipientId, message) => {
  const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  await axios.post(url, {
    recipient: { id: recipientId },
    message: { text: message }
  });
};

module.exports = { sendMessage };
