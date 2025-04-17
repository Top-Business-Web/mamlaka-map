importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCZK--BS46mGae50fbRWsxmL6N9x8RqMDE",
    authDomain: "malakia-cd959.firebaseapp.com",
    databaseURL: "https://malakia-cd959-default-rtdb.firebaseio.com",
    projectId: "malakia-cd959",
    storageBucket: "malakia-cd959.firebasestorage.app",
    messagingSenderId: "111578269732",
    appId: "1:111578269732:web:f9aac12af7d78438e170b1",
    measurementId: "G-6LEGY36DNX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});