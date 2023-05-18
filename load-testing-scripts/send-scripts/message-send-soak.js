export const options = {
    stages: [
       { duration: '1m', target: 0 },
       { duration: '1m', target: 10 },
       { duration: '1m', target: 20 },
       { duration: '1m', target: 30 },
       { duration: '1m', target: 40 },
       { duration: '1h', target: 50 },
       { duration: '1m', target: 40 },
       { duration: '1m', target: 30 },
       { duration: '1m', target: 20 },
       { duration: '1m', target: 10 },
       { duration: '1m', target: 0 },
    ]
} 



export default function() {
    const url = 'http://localhost:8082/api/messages'

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njg2NjE5MTMsImlhdCI6MTY4MjI2MTkxMywicmVmcmVzaCI6ZmFsc2UsInVzZXIiOiJ0ZXN0X2FwaSIsInVzZXJfaWQiOiI2NDQ1NDY1ZjE2MzJiYTkwYjJkYjMxZWIifQ.gl4Wm51hoQ0_28E45ab8VVxEQcPibJy-vxfsJBn48QY'


    const payload = JSON.stringify({
        topic: '644550a314c341d7f6eb5a0b',
        content: 'Lorem ipsum bla bla bla'
    })

    const params = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    console.log('About to send message')
    http.post(url, payload, params)
    sleep(1)
    console.log('Message sent')

}