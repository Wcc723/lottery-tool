import {
  createApp,
  ref,
  reactive,
  watch,
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.5/vue.esm-browser.min.js';
import { csvJSON } from './helpers/utilities.js';

const app = createApp({
  setup() {
    const nav = ref('lottery-list');

    return {
      nav,
    };
  },
});

app.component('lottery-items', {
  template: '#lottery-items',
  setup() {
    const itemList = ref([{ id: new Date().getTime(), title: '', num: 1 }]);
    const addItem = () => {
      itemList.value.push({ id: new Date().getTime(), title: '', num: 1 });
    };
    const removeItem = (id) => {
      const index = itemList.value.findIndex((item) => item.id === id);
      itemList.value.splice(index, 1);
    };

    const saveItemToLocalStorage = () => {
      localStorage.setItem('lotteryItems', JSON.stringify(itemList.value));
    };

    const loadItemFromLocalStorage = () => {
      const items = localStorage.getItem('lotteryItems');
      if (items) {
        itemList.value = JSON.parse(items);
      }
    };

    return {
      itemList,
      addItem,
      removeItem,
      saveItemToLocalStorage,
      loadItemFromLocalStorage,
    };
  },
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

    const tempLotteryItem = ref({});
    const lotteryItem = ref({
      title: '',
      num: 1,
    });

    const userData = reactive({
      title: '六角學院 - 抽獎系統',
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
    watch(
      lotteryItem,
      () => {
        // 如果有選擇抽獎項目，就把抽獎項目的名稱放到 lotteryGame.winner
        if (!lotteryGame.winner[lotteryItem.value.title]) {
          lotteryGame.winner[lotteryItem.value.title] = {
            num: lotteryItem.value.num,
            title: lotteryItem.value.title,
            list: [],
          };
        }
        console.log(lotteryItem);
      },
    );

    const lotteryGame = reactive({
      userList: [],
      winner: {},
      isStart: false,
    });
    const getLottery = () => {
      console.log(lotteryItem.value);
      if (!lotteryGame.isStart) {
        // 如果還沒開始，就重置資料
        lotteryGame.userList = [...userData.userArray];
        lotteryGame.isStart = true;
      }

      // 如果還有名額
      if (
        lotteryItem.value.num > lotteryGame.winner[lotteryItem.value.title]?.list?.length
      ) {
        const userLength = lotteryGame.userList.length;
        const winIndex = Math.floor(Math.random() * userLength);
        if (!lotteryGame.userList[winIndex]) {
          return alert('沒人了怎麼抽');
        }
        const winUser = lotteryGame.userList[winIndex];
        console.log(winUser);
        if (userData.noRepeat) {
          // 如果不允許重複
          lotteryGame.userList.splice(winIndex, 1);
        }
        lotteryGame.winner[lotteryItem.value.title]?.list?.push({
          id: new Date().getTime(),
          title: lotteryItem.value.title,
          ...winUser,
        });
      } else {
        alert('名額已滿');
      }
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
      tempLotteryItem,

      getLottery,
      reset,

      itemList,
      loadItemFromLocalStorage,
    };
  },
});

app.mount('#app');
