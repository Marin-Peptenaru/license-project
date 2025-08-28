import {sleep} from "k6"
import http from "k6/http"
import { authenticate, authenticatedHeaders, endpoints, getOwnedTopics, refreshAuthentication } from "./utils.js"

export default function() {
    const username = __ENV.CREDENTIALS_USERNAME
    const password = __ENV.CREDENTIALS_PASSWORD

    const tokens = authenticate(username, password)
    const topics = getOwnedTopics(username, tokens.auth)
    console.log("Topics to which messages will be sent: ", topics.map(t => t.title))
    const topicIds = topics.map(t => t.id)

    const messageContent = " - Test message sent by k6 testing script. \n - This message will be send to a randomly selected topic among the ones passed as variables to the testing script \n  - This message should only be viewed by users who are subscribed to the topic to which it was sent \n"
    
    while(true) {
        const randomIndex = Math.floor(Math.random() * 100) % topics.length
        const res = http.post(
            endpoints.send, 
            JSON.stringify({
                topic: topicIds[randomIndex],
                content: messageContent 
            }),
            { headers: authenticatedHeaders(tokens.auth) }
        )
        
        if(res.status === 401) {
            console.log('Authentication expired...')
            tokens.auth = refreshAuthentication(tokens.refresh)

            if(!tokens.auth) {
                console.error('Could not refresh authentication, ending test...')
                break
            } else {
                console.log('Authentication refreshed')
            }
        } else if(res.status != 200) {
            console.error('An error occurred when sending the message')
            console.error(res.body)
        } else {
            console.log(`Message was sent successfully to topic ${topics[randomIndex].title}!`)
        }

        sleep(1)
    }
}