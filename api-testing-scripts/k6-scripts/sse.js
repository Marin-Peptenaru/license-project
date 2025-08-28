import sse from "k6/x/sse"
import {authenticate, authenticatedHeaders, MockSubscriptionHandler, refreshAuthentication } from "./utils.js"
import {check} from "k6"

function listenForMessages(token, subscriptionHandler) {
    const params = {
        method: 'GET',
        headers: authenticatedHeaders(token)
    }

    var authExpired = false;

    const res = sse.open('http://localhost:8081/api/messages/stream', params, function(client) {
        client.on('open', function open(){
            console.warn('sse connected')
        })

        client.on('event', function(event) {
            if(event.name === 'auth-expired') {
                authExpired = true
            } else {
                if(event.data) {
                    console.log('Event received: ', JSON.parse(event.data))
                }
            }
            subscriptionHandler.changeSubscriptions()
        })

        client.on('error', function(e) {
            console.error('An error has occurred: ', e.error())
        })
    })

    check(res, {
        "sse connection returned status 200": (r) => r.status === 200
    })

    return authExpired;
}

export default function() {
    const tokens = authenticate(__ENV.CREDENTIALS_USERNAME, __ENV.CREDENTIALS_PASSWORD)
    const subscriptionsHandler = new MockSubscriptionHandler(tokens.auth, __VU)

    var authExpired = false;
    do {
        authExpired = listenForMessages(tokens.auth, subscriptionsHandler)

        if(authExpired) {
            console.log("refreshing authentication....")
            const refreshedToken = refreshAuthentication(tokens.refresh)
            if(refreshedToken) {
                console.log("authentication refreshed")
                tokens.auth = refreshedToken
                subscriptionsHandler.setToken(tokens.auth)
            } else {
                break
            }
        }

    } while(authExpired)

    console.error("test execution has ended for some other reason")
}