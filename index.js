const signalingServerUrl = 'wss://your-custom-websocket-server-url'; // Replace with your WebSocket server URL
const signalingSocket = new WebSocket(signalingServerUrl);

let webrtc;
let currentRoom = null; // Track the current room

// WebSocket events
signalingSocket.onmessage = async (event) => {
    try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);

        if (message.type === 'offer' || message.type === 'answer' || message.type === 'candidate') {
            if (webrtc) {
                webrtc.signal(message);
            }
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
    const roomName = document.getElementById('roomNameInput').value.trim();
    if (!roomName) {
        alert('Please enter a room name.');
        return;
    }

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

        webrtc.on('readyToCall', () => {
            webrtc.joinRoom(roomName);
            currentRoom = roomName; // Save the current room name
            console.log('Joined room:', roomName);
        });

        webrtc.on('videoAdded', (video, peer) => {
            console.log('Remote video added', video, peer);
        });

        webrtc.on('videoRemoved', (video, peer) => {
            console.log('Remote video removed', video, peer);
            video.srcObject = null;
        });
    } else {
        alert('You are already in a call.');
    }
});

document.getElementById('endCallBtn').addEventListener('click', () => {
    if (webrtc) {
        webrtc.leaveRoom();
        webrtc.stopLocalVideo(); // Stop local video stream
        webrtc.webrtc.peers.forEach(peer => {
            peer.pc.close(); // Close all peer connections
        });
        webrtc = null; // Clear WebRTC instance
        currentRoom = null; // Clear the room name
        console.log('Call ended.');
    } else {
        alert('No active call to end.');
    }
});

// Chat functionality
document.getElementById('sendMsgBtn').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value.trim();
    if (message && currentRoom) {
        signalingSocket.send(JSON.stringify({ type: 'chat', text: message }));
        document.getElementById('messageInput').value = '';
    } else if (!currentRoom) {
        alert('You must be in a call to send messages.');
    }
});
