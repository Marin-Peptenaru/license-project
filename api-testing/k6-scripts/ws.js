import {authenticate, MockSubscriptionHandler, refreshAuthentication} from "./utils.js"
import ws from 'k6/ws'
import {check} from 'k6'

export default function() {

    var tokens = undefined
    const username = __ENV.CREDENTIALS_USERNAME
    const password = __ENV.CREDENTIALS_PASSWORD
    const subscriptionChangeInterval = __ENV.SUB_CHANGE_INTERVAL ?? 5000
    const url = 'ws://localhost:8888/api/messages/stream/'

    var subscriptionHandler = undefined
    const res = ws.connect(url,{}, function(socket) {
        socket.on('open', () => console.warn('ws connected'))

        socket.on('message', (data) => {
            const msg = JSON.parse(data)
            if(msg == "authenticate") {
                console.log('Authentication has expired, refreshing...')
                if(!tokens) {
                    tokens = authenticate(username, password)
                    subscriptionHandler = new MockSubscriptionHandler(tokens.auth, __VU)
                    socket.setInterval(() => subscriptionHandler.changeSubscriptions(), subscriptionChangeInterval)
                } else {
                    tokens.auth = refreshAuthentication(tokens.refresh)
                    subscriptionHandler.setToken(tokens.auth)
                }
                socket.send(tokens.auth)
                console.log('Authentication refreshed')
            } else {
                console.log('Message received: ', msg)
            }
        })

        socket.on('close', () => console.log('ws disconnected'))
    }) 

    check(res, {'status is 101': (r) => r && r.status === 101})

}