var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njg2NjE5MTMsImlhdCI6MTY4MjI2MTkxMywicmVmcmVzaCI6ZmFsc2UsInVzZXIiOiJ0ZXN0X2FwaSIsInVzZXJfaWQiOiI2NDQ1NDY1ZjE2MzJiYTkwYjJkYjMxZWIifQ.gl4Wm51hoQ0_28E45ab8VVxEQcPibJy-vxfsJBn48QY'

const eventSourceInitParams = {
    https: {rejectUnauthorized: false}, 
    headers: {'Authorization': `Bearer ${token}`, 'Access-Control-Allow-Origin': '*'}
}

import('@titelmedia/node-fetch').then(function (fetch) {
    globalThis.fetch = fetch.default;
    globalThis.Response = fetch.default.Response;
    console.log('here')
    import('event-source-polyfill').then(function (x) {

      console.log('Event source module imported')
      var es = new x.default.EventSourcePolyfill('http://localhost:8081/api/messages/stream', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      es.onerror = es.onopen = es.onmessage = function (event) {
        console.log(event.type + ': ' + event.data);
      };
    });
});



while(true) {
    
  
}