import { ref } from 'vue';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/constants.js';
import { createErrors } from '@/api/util.js';

export const socket = ref(null);

export const connectSocket = (token) => {
  if (socket.value && socket.value.connected) return;

  socket.value = io(BASE_URL, {
    query: {
      authToken: token
    },
    transports: ['websocket'],
    autoConnect: true
  });

  socket.value.on('connect_error', (err) => {
    createErrors(['Error connecting socket: ', err]);
  });
};

export const disconnectSocket = () => {
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
};

export const onEvent = (event, callback) => {
  if (!socket.value) return;
  socket.value.on(event, callback);
};
