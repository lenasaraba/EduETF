importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB4SzYhlLozSjJyZ98lAjaJ1h5PFMaQWpc",
  authDomain: "eduetf-95ea5.firebaseapp.com",
  projectId: "eduetf-95ea5",
  storageBucket: "eduetf-95ea5.appspot.com",
  messagingSenderId: "501055750353",
  appId: "1:501055750353:web:830661f3e389c81707c5f0"
};


  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Nova poruka';
  const notificationOptions = {
    body: payload.notification?.body || 'Imate novu poruku!',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});