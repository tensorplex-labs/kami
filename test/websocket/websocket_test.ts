import { io } from 'socket.io-client';

const socket = io('http://localhost:8882');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // Test ping first
  socket.emit('ping', 'hello');

  console.log('Subscribing to blocks...');
  socket.emit('subscribe-blocks', true);
});

socket.on('pong', (data: any) => {
  console.log('Ping response:', data);
});

socket.on('subscription-confirmed', (data: any) => {
  console.log('Block subscription confirmed:', data);
});

socket.on('subscription-error', (data: any) => {
  console.error('Block subscription error:', data);
});

socket.on('new-block', (blockInfo: any) => {
  console.log('New block received:', blockInfo);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error: any) => {
  console.error('Connection error:', error);
});

// Disconnect after 30 seconds for testing
//  setTimeout(() => {
//    console.log('Test complete, disconnecting...');
//    socket.disconnect();
//  }, 30000);
