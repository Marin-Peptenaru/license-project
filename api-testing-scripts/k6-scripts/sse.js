import sse from "k6/x/sse"
import {authenticate, authenticatedHeaders } from "./utils.js"
import {check} from "k6"

export default function() {
    const tokens = authenticate('subscriber', 'Password123!')
    const params = {
        method: 'GET',
        headers: authenticatedHeaders(tokens.auth)
    }

    const res = sse.open('http://localhost:8081/api/messages/stream', params, function(client) {
        client.on('open', function open(){
            console.log('sse connected')
        })

        client.on('event', function(event) {
            console.log('Event received: ', JSON.parse(event.data))
        })

        client.on('error', function(e) {
            console.log('An error has occurred: ', e.error())
        })
    })

    check(res, {"status is 200": (r) => r && r.status === 200})
}