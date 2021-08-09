import { createApp, ref, reactive, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.5/vue.esm-browser.min.js';
import { csvJSON } from './helpers/utilities.js';

const app = createApp({
  setup() {
    const userData = reactive({
      title: '卡斯伯中大獎',
      itemName: '100 吋大電視',
      userList: '',
      num: 1,
      noRepeat: true,
      userArray: []
    });

    watch(() => userData.userList,
      () => {
        userData.userArray = csvJSON(userData.userList)
      }
    );

    const lotteryGame = reactive({
      userList: [],
      winner: [],
      isStart: false,
    });
    const getLottery = () => {
      if (!lotteryGame.isStart) {
        // 如果還沒開始，就重置資料
        lotteryGame.userList = [ ...userData.userArray ];
        lotteryGame.isStart = true;
      }
      
      const winner = [];
      for (let i = 0; i < userData.num; i++) {
        let userLength = lotteryGame.userList.length;
        const winIndex = Math.floor(Math.random()*userLength);
        if (!lotteryGame.userList[winIndex]) { return alert('沒人了怎麼抽'); }
        const winUser = lotteryGame.userList[winIndex];
        console.log('抽中編號：', winIndex);
        winner.push(winUser);
        if (userData.noRepeat) { // 如果不允許重複
          lotteryGame.userList.splice(winIndex, 1);
        }
      }
      console.log(winner);
      lotteryGame.winner.push({
        id: new Date().getTime(),
        title: userData.itemName,
        num: userData.num,
        winner
      })

    }
    const reset = () => {
      lotteryGame.userList = [];
      lotteryGame.winner = [];
      lotteryGame.isStart = false;
    }

    return {
      userData,
      lotteryGame,
      
      getLottery,
      reset,
    }
  }
});



app.mount('#app');
