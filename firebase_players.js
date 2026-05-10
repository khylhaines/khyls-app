import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3xKKLg1--aYYO0zg5NzySEZSWsw_xcoM",
  authDomain: "barrow-quest.firebaseapp.com",
  databaseURL: "https://barrow-quest-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "barrow-quest",
  storageBucket: "barrow-quest.firebasestorage.app",
  messagingSenderId: "139844399218",
  appId: "1:139844399218:web:b7745397cf7420655ad2eb",
  measurementId: "G-651YE106QR"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

window.firebasePlayers = {
  db,

  async updatePlayer(playerId, data) {
    await set(ref(db, "players/" + playerId), data);
  },

  watchPlayers(callback) {
    const playersRef = ref(db, "players");

    onValue(playersRef, (snapshot) => {
      callback(snapshot.val() || {});
    });
  },

  removePlayer(playerId) {
    return remove(ref(db, "players/" + playerId));
  },

  setupDisconnect(playerId) {
    onDisconnect(ref(db, "players/" + playerId)).remove();
  }
};
