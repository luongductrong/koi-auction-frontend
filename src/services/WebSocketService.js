import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
  }

  connect(auctionId, displayBidUpdate, displayNotification) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || ''; // Get the WebSocket URL from the environment variables
    console.log('WebSocket URL:', socketUrl);
    const socket = new SockJS(socketUrl);
    this.stompClient = Stomp.over(() => socket);
    // this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      console.log('Connected to WebSocket:', frame);

      this.stompClient.subscribe(`/topic/auction/${auctionId}/bids`, function (message) {
        const bidUpdate = JSON.parse(message.body);
        displayBidUpdate(bidUpdate);
      });

      this.stompClient.subscribe(`/topic/auction/${auctionId}`, function (message) {
        console.log('Notification:', message);
        const notification = JSON.parse(message.body);
        displayNotification(notification);
      });
    });
  }

  connectToChatService(token, senderId, receiverId, displayChatMessage) {
    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const socket = new SockJS(socketURL);
    this.stompClient = Stomp.over(socket);
    const self = this; // Lưu giá trị `this`

    this.stompClient.connect({ Authorization: 'Bearer ' + token }, function (frame) {
      console.log('Connected to WebSocket: ' + frame);
      // console.log(token);

      const chatRoom = senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
      // console.log('chatRoom', chatRoom);

      self.stompClient.subscribe(`/topic/room-${chatRoom}`, function (message) {
        const chatMessage = JSON.parse(message.body);
        displayChatMessage(chatMessage);
      });
    });
  }

  // Method to send messages
  sendMessage(destination, message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }
}

export default new WebSocketService();
