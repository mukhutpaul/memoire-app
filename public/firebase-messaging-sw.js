importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyBvfEjuhLJOOcML-82A4yKJdNTDS8UMt6c",
  authDomain: "ap-user-c9656.firebaseapp.com",
  projectId: "ap-user-c9656",
  messagingSenderId: "288951499519",
  appId: "1:288951499519:web:436e9101ee1380bb812aca",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
    badge: "/badge.png",
  })
})
