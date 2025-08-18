import {authenticate, refreshAuthentication} from "./utils.js"
import ws from 'k6/ws'
import {check} from 'k6'

export default function() {

    var tokens = undefined
    const username = 'subscriber'
    const password = 'Password123!'
    const url = 'ws://localhost:8081/api/messages/stream'

    const res = ws.connect(url,{}, function(socket) {
        socket.on('open', () => console.log('ws connected'))

        socket.on('message', (data) => {
            if(data === 'token exp') {
                console.log('Authentication has expired, refreshing...')
                if(!tokens) {
                    tokens = authenticate(username, password)
                } else {
                    tokens.auth = refreshAuthentication(tokens.refresh)
                }
                socket.send(tokens.auth)
                console.log('Authentication refreshed')
            } else {
                console.log('Message received: ', JSON.parse(data))
            }
        })

        socket.on('close', () => console.log('ws disconnected'))
    }) 

    check(res, {'status is 101': (r) => r && r.status === 101})


}