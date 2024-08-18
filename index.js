const signalingServerUrl = 'wss://your-websocket-server-url'; // Replace with your WebSocket server URL
const signalingSocket = new WebSocket(signalingServerUrl);

let webrtc;

// WebSocket events
signalingSocket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message); // Debugging line

        if (webrtc) {
            webrtc.signal(message);
        }

        if (message.type === 'chat') {
            const messagesDiv = document.getElementById('messages');
            const messageEl = document.createElement('div');
            messageEl.textContent = message.text;
            messagesDiv.appendChild(messageEl);
        }
    } catch (error) {
        console.error('Error processing WebSocket message:', error);
    }
};

// SimpleWebRTC setup
document.getElementById('startCallBtn').addEventListener('click', () => {
    if (!webrtc) {
        webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remoteVideo',
            autoRequestMedia: true,
            url: signalingServerUrl,
            onMessage: (message) => {
                signalingSocket.send(JSON.stringify(message));
            }
        });

        webrtc.on('readyToCall', function () {
            webrtc.joinRoom('uniqueRoomName'); // Replace with a unique room name
        });
    } else {
        console.warn('WebRTC instance already exists.');
    }
});

document.getElementById('endCallBtn').addEventListener('click', () => {
    if (webrtc) {
        webrtc.leaveRoom();
        webrtc = null; // Clear WebRTC instance
    } else {
        console.warn('No WebRTC instance to end.');
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
