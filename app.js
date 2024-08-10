// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYwm1Xw3uDQjWIYbd-8_IjUBd_4bf0e54",
  authDomain: "lifafa-fb6bd.firebaseapp.com",
  databaseURL: "https://lifafa-fb6bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lifafa-fb6bd",
  storageBucket: "lifafa-fb6bd.appspot.com",
  messagingSenderId: "667404048293",
  appId: "1:667404048293:web:50da855dbf088a3f26fa4c",
  measurementId: "G-ZXE7K9SGC9"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Send message
document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message.trim()) {
        database.ref('messages').push().set({ message: message });
        messageInput.value = '';
    }
});

// Receive messages
database.ref('messages').on('child_added', function(snapshot) {
    const message = snapshot.val().message;
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});