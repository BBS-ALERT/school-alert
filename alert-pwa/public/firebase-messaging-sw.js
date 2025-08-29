// Firebase Messaging Service Worker
//importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
//importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

//firebase.initializeApp({
//  apiKey: "YOUR_API_KEY",
//////  projectId: "YOUR_PROJECT_ID",
//  messagingSenderId: "YOUR_SENDER_ID",
//  appId: "YOUR_APP_ID"
//});

//const messaging = firebase.messaging();

//messaging.onBackgroundMessage(function(payload) {
//  self.registration.showNotification(
//    payload.notification.title,
//    {
    //  body: payload.notification.body,
  //    icon: '/icon-192.png'
//   }
//  );
//});

// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAbohcONTb1FGRjPiVxWblTc-esImwEcI8",
  authDomain: "bbs-alert.firebaseapp.com",
  projectId: "bbs-alert",
  storageBucket: "bbs-alert.appspot.com",
  messagingSenderId: "188088530343",
  appId: "1:188088530343:web:63f5a52963276ed0cdf282",
  measurementId: "G-3E21ZRM641"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  self.registration.showNotification(
    payload.notification?.title || "New Alert",
    {
      body: payload.notification?.body,
      icon: '/icons/icon-192x192.png' // make sure this file exists
    }
  );
});
