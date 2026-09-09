const cron = require('node-cron');
const { getThereIsNoReport } = require('../services/index');
const { NOTIFICATIONS } = require('../constants/index');
const { sendMessage } = require('../config/vkApi');
require('dotenv').config();

// Временная функция потом заменится на полноценный task
async function reminderTask() {
  const openIsEight = () => {
    cron.schedule('40,45,50,55 7 * * *', async () => {
        const report = await getThereIsNoReport('open', '08:00:00');
  
        if(report.success) {
          const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'open')
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, reportMessage)
        } else {
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED)
        }

        if (report.message === "Все пункты отписались") {
          task.stop();
          return;
        }
      },
      {
        timezone: "Europe/Moscow"
      }
    );
  }

  const openIsTen = () => {
    cron.schedule('30,40,50 9 * * *', async () => {
        const report = await getThereIsNoReport('open');
  
        if(report.success) {
          const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'open')
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, reportMessage)
        } else {
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED)
        }

        if (report.message === "Все пункты отписались") {
          task.stop();
          return;
        }
      },
      {
        timezone: "Europe/Moscow"
      }
    );
  }

  const closeInEight = () => {
      cron.schedule('15,30 21 * * *', async () => {
        const report = await getThereIsNoReport('close', "21:00:00");
  
        if(report.success) {
          const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'close')
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, reportMessage)
        } else {
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED)
        }

        if (report.message === "Все пункты отписались") {
          task.stop();
          return;
        }
      },
      {
        timezone: "Europe/Moscow"
      }
    );
  }

    const closeInTen = () => {
      cron.schedule('15,30 22 * * *', async () => {
        const report = await getThereIsNoReport('close', "22:00:00");
  
        if(report.success) {
          const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'close')
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, reportMessage)
        } else {
          await sendMessage(process.env.VK_CHAT_ID_REMINDER, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED)
        }

        if (report.message === "Все пункты отписались") {
          task.stop();
          return;
        }
      },
      {
        timezone: "Europe/Moscow"
      }
    );
  }

  openIsEight();
  openIsTen();
  closeInEight();
  closeInTen();
}

module.exports = { reminderTask }