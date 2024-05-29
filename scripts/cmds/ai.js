const axios = require('axios');

const Prefixes = [
  'ai',
  'ask',
  'gpt',
];

module.exports = {
  config: {
    name: 'aiv3',
    version: '2.5',
    author: 'Jay', // do not change
    role: 0,
    category: 'ai',
    shortDescription: {
      en: 'Asks an AI for an answer.',
    },
    longDescription: {
      en: 'Asks an AI for an answer based on the user prompt.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      if (!prefix) {
        return; 
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (prompt === '') {
        await message.reply(
          "Kindly provide a question or query."
        );
        return;
      }

      await message.reply("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨.......");

      const response = await axios.get(`https://ai-chat-gpt-4-lite.onrender.com/api/hercai?question=${encodeURIComponent(prompt)}`); // replace API_URL with the actual API URL

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const messageText = response.data.content.trim();

      const moment = require('moment-timezone');

      // Assuming 'messageText' contains the message content

      const philippinesTime = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');

      message.reply({
        body: `  𝗚𝗣𝗧4 👾: ${messageText}\n\n

𝗗𝗲𝘃 𝗟𝗶𝗻𝗸: https://www.facebook.com/profile.php\n\n
𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${philippinesTime}\n\n`,
      });

      console.log('Sent answer as a reply to user');
    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      api.sendMessage(
        `${error.message}.\\You can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
        event.threadID
      );
    }
  },
};
