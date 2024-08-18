const signalingServerUrl = 'wss://echo.websocket.org'; // Public WebSocket server URL
const signalingSocket = new WebSocket(signalingServerUrl);

let webrtc;

// WebSocket events
signalingSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case 'offer':
        case 'answer':
        case 'candidate':
            webrtc.signal(message);
            break;
    }
};

// SimpleWebRTC setup
document.getElementById('startCallBtn').addEventListener('click', () => {
    webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideo',
        autoRequestMedia: true,
        // WebSocket signaling
        url: signalingServerUrl,
        onMessage: (message) => {
            signalingSocket.send(JSON.stringify(message));
        }
    });

    webrtc.on('readyToCall', function () {
        webrtc.joinRoom('uniqueRoomName'); // Replace with a unique room name
    });
});

document.getElementById('endCallBtn').addEventListener('click', () => {
    if (webrtc) {
        webrtc.leaveRoom();
    }
});

// Chat functionality
document.getElementById('sendMsgBtn').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    if (message.trim()) {
        signalingSocket.send(JSON.stringify({ type: 'chat', text: message }));
        document.getElementById('messageInput').value = '';
    }
});

// Display chat messages
signalingSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'chat') {
        const messagesDiv = document.getElementById('messages');
        const messageEl = document.createElement('div');
        messageEl.textContent = message.text;
        messagesDiv.appendChild(messageEl);
    }
};