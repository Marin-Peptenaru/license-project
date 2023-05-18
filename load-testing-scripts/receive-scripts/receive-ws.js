import WebSocket from "ws";


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njg2NjE5MTMsImlhdCI6MTY4MjI2MTkxMywicmVmcmVzaCI6ZmFsc2UsInVzZXIiOiJ0ZXN0X2FwaSIsInVzZXJfaWQiOiI2NDQ1NDY1ZjE2MzJiYTkwYjJkYjMxZWIifQ.gl4Wm51hoQ0_28E45ab8VVxEQcPibJy-vxfsJBn48QY'

const wsUrl = `ws://localhost:8081/api/messages/ws?auth=${token}`

const ws = new WebSocket(wsUrl)

ws.onmessage = async (event) => {
    console.log(event)
}

ws.onerror = console.error


ws.onclose = () => {
    console.log('ws connection closed')
}


ws.onopen = () => {
    console.log('connected')
}

while(true){

}