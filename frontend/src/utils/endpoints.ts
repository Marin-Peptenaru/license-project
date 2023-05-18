const writeServer = 'http://localhost:8082'
const auth = writeServer + '/api/auth'
const users = writeServer + '/api/users'
const topics = writeServer + '/api/topics'
const subscribe = topics + '/subscribe'
const unsubscribe = topics + '/unsubscribe'

const readServer = 'http://localhost:8081'
const messages = readServer + '/api/messages'
const messageStream = messages + '/stream'
const messageSend = writeServer + '/api/messages'



export {
    writeServer as server,
    auth,
    users,
    topics,
    subscribe,
    unsubscribe,
    messages,
    messageStream,
    messageSend
}