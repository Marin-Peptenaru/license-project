import ws from 'k6/ws';
import { check } from 'k6';

export default function () {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njg2NjE5MTMsImlhdCI6MTY4MjI2MTkxMywicmVmcmVzaCI6ZmFsc2UsInVzZXIiOiJ0ZXN0X2FwaSIsInVzZXJfaWQiOiI2NDQ1NDY1ZjE2MzJiYTkwYjJkYjMxZWIifQ.gl4Wm51hoQ0_28E45ab8VVxEQcPibJy-vxfsJBn48QY'
  const url = `ws://localhost:8081/api/messages/ws?auth=${token}`;
  const params = { };

  const response = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log('connected');
    });

    socket.on('message', function (message) {
      console.log(`Received message: ${message}`);
    });

    socket.on('close', function () {
      console.log('disconnected');
    });

    socket.on('error', function (e) {
      if (e.error() != 'websocket: close sent') {
        console.log('An unexpected error occured: ', e.error());
      }
    });

    socket.setTimeout(function () {
      console.log('2 minutes passed, closing the socket');
      socket.close();
    }, 2 * 60 * 1000);
  });

  check(response, { 'status is 101': (r) => r && r.status === 101 });
}