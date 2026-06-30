const https = require("https");
const querystring = require("querystring");

// Базовые параметры
const VK_API_VERSION = "5.199";
const VK_API_URL = "api.vk.com";

async function editMessage(peerId, existingMsgId, message, keyboard) {
  await vkApiCall("messages.edit", {
    peer_id: peerId,
    conversation_message_id: existingMsgId,
    message: message,
    keyboard: JSON.stringify(keyboard),
    v: VK_API_VERSION,
    access_token: process.env.VK_GROUP_TOKEN,
  });
}

// Отправка сообщения
async function sendMessage(peerId, message, keyboard = null) {
  const randomId = Date.now(); // или любое уникальное число

  const params = {
    peer_id: peerId,
    message: message,
    random_id: randomId,
    v: VK_API_VERSION,
    access_token: process.env.VK_GROUP_TOKEN,
  };

  if (keyboard) {
    params.keyboard = JSON.stringify(keyboard);
  }

  return vkApiCall("messages.send", params);
}

// Получение информации о пользователе
async function getUserInfo(userId) {
  const params = {
    user_ids: userId,
    fields: "first_name,last_name,screen_name,sex",
    v: VK_API_VERSION,
    access_token: process.env.VK_GROUP_TOKEN,
  };

  const result = await vkApiCall("users.get", params);
  return result[0] || null;
}

// Универсальный вызов API
function vkApiCall(method, params) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(params);

    const options = {
      hostname: VK_API_URL,
      port: 443,
      path: `/method/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(
              new Error(
                `VK API Error ${response.error.error_code}: ${response.error.error_msg}`,
              ),
            );
          } else {
            resolve(response.response);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// Запуск Long Poll
async function startLongPoll(callback) {
  let ts = null;
  let server = null;
  let key = null;

  // Получаем сервер для Long Poll
  const getLongPollServer = async () => {
    const response = await vkApiCall("groups.getLongPollServer", {
      group_id: process.env.VK_GROUP_ID,
      access_token: process.env.VK_GROUP_TOKEN,
      v: VK_API_VERSION,
    });

    server = response.server;
    key = response.key;
    ts = response.ts;
  };

  await getLongPollServer();

  // Основной цикл опроса
  const poll = async () => {
    try {
      const url = `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`;

      const response = await new Promise((resolve, reject) => {
        https
          .get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              try {
                resolve(JSON.parse(data));
              } catch (e) {
                reject(e);
              }
            });
          })
          .on("error", reject);
      });

      if (response.failed) {
        // Переподключаемся при ошибке
        await getLongPollServer();
        setTimeout(poll, 1000);
        return;
      }

      ts = response.ts;

      // Обрабатываем события
      for (const update of response.updates) {
        await callback(update);
      }

      setTimeout(poll, 0);
    } catch (error) {
      setTimeout(poll, 5000);
    }
  };

  await poll();
}

async function answerCallbackQuery(eventId, userId, peerId, text) {
  const params = {
    event_id: eventId,
    user_id: userId,
    peer_id: peerId,
    text: text,
    type: 'show_snackbar',  // покажет уведомление
    v: VK_API_VERSION,
    access_token: process.env.VK_GROUP_TOKEN
  };
  
  return vkApiCall('messages.sendMessageEventAnswer', params);
}

async function deleteUserFromChatQuery(userId, chatId) {
  // Преобразуем peer_id в chat_id
  if (chatId > 2000000000) {
    chatId = chatId - 2000000000;
  }
  
  const params = {
    chat_id: chatId,
    user_id: userId,
    v: VK_API_VERSION,
    access_token: process.env.VK_GROUP_TOKEN,
  };

  try {
    const result = await vkApiCall("messages.removeChatUser", params);
    return { success: true, chatId, message: result };
  } catch (error) {
    return { success: false, chatId, message: error.message };
  }
}

module.exports = {
  editMessage,
  sendMessage,
  getUserInfo,
  vkApiCall,
  startLongPoll,
  answerCallbackQuery,
  deleteUserFromChatQuery,
  VK_API_VERSION,
};
