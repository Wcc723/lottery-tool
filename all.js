import { createApp, ref, reactive, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.5/vue.esm-browser.min.js';
import { csvJSON } from './helpers/utilities.js';




const app = createApp({
  setup() {
    const nav = ref('lottery-list');

    return {
      nav,
    }
  }
});

app.component('lottery-items', {
  template: '#lottery-items',
  setup() {
    const itemList = ref([
      {id: new Date().getTime(), title: '', num: 1}
    ])
    const addItem = () => {
      itemList.value.push({ id: new Date().getTime(), title: '', num: 1});
    };
    const removeItem = (id) => {
      const index = itemList.value.findIndex((item) => item.id === id);
      itemList.value.splice(index, 1);
    }

    const saveItemToLocalStorage = () => {
      localStorage.setItem('lotteryItems', JSON.stringify(itemList.value));
    }

    const loadItemFromLocalStorage = () => {
      const items = localStorage.getItem('lotteryItems');
      if (items) {
        itemList.value = JSON.parse(items);
      }
    }

    return {
      itemList,
      addItem,
      removeItem,
      saveItemToLocalStorage,
      loadItemFromLocalStorage,
    };
  }
});

app.component('lottery-list', {
  template: '#lottery-list',
  setup() {
    const itemList = ref([]);
    const loadItemFromLocalStorage = () => {
      const items = localStorage.getItem('lotteryItems');
      if (items) {
        itemList.value = JSON.parse(items);
      }
    };
    const lotteryItem = ref({
      title: '',
      num: 1,
    })

    const userData = reactive({
      title: '卡斯伯中大獎',
      userList: '',
      noRepeat: true,
      userArray: [],
    });

    watch(
      () => userData.userList,
      () => {
        userData.userArray = csvJSON(userData.userList);
      },
    );

    const lotteryGame = reactive({
      userList: [],
      winner: [],
      isStart: false,
    });
    const getLottery = () => {
      console.log(lotteryItem.value);
      if (!lotteryGame.isStart) {
        // 如果還沒開始，就重置資料
        lotteryGame.userList = [...userData.userArray];
        lotteryGame.isStart = true;
      }

      const winner = [];
      for (let i = 0; i < lotteryItem.value.num; i++) {
        let userLength = lotteryGame.userList.length;
        const winIndex = Math.floor(Math.random() * userLength);
        if (!lotteryGame.userList[winIndex]) {
          return alert('沒人了怎麼抽');
        }
        const winUser = lotteryGame.userList[winIndex];
        console.log('抽中編號：', winIndex);
        winner.push(winUser);
        if (userData.noRepeat) {
          // 如果不允許重複
          lotteryGame.userList.splice(winIndex, 1);
        }
      }
      console.log(winner);
      lotteryGame.winner.push({
        id: new Date().getTime(),
        title: lotteryItem.value.title,
        num: lotteryItem.value.num,
        winner,
      });
    };
    const reset = () => {
      lotteryGame.userList = [];
      lotteryItem.value = {
        title: '',
        num: 1,
      };
      lotteryGame.winner = [];
      lotteryGame.isStart = false;
    };

    return {
      userData,
      lotteryGame,
      lotteryItem,

      getLottery,
      reset,

      itemList,
      loadItemFromLocalStorage,
    };
  },
});

app.mount('#app');
