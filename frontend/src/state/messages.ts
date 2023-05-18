import type { EventSourcePolyfill } from "event-source-polyfill";
import { derived, writable, get } from "svelte/store";
import type { Message } from "../domain/message";
import type { Topic } from "../domain/topic";
import { MessagesAPI } from "../network/messages";
import { viewedTopic } from "./topics";
import { tokenExpired } from "./auth";
import type { SendMessageDTO } from "../dtos/SendMessageDTO";
import {getToken} from "../state/auth"

const _messages = writable([] as Message[])

const messages = derived(_messages, $messages => $messages)

let messageEventSource: EventSourcePolyfill
let topic: Topic
let messageWS: WebSocket



const fetchMessages = async (topicTitle: string, after: Date = new Date(0)) => {
    MessagesAPI.fetchMessages(topicTitle, after, await getToken()).then((fetchedMessages) => {
        _messages.set(fetchedMessages)
    })
}

const listenForMessages = async () => {
    messageEventSource =  await MessagesAPI.messagesSource(await getToken())
    messageEventSource.onmessage = processEvent
    console.log("started listening for messages")
}

const listenForMessagesWS = async () => {
  messageWS = await MessagesAPI.listenForMessagesWS(await getToken())

  messageWS.onopen = async () => {
     console.log("connected to ws")
  }

  messageWS.onmessage = async (event) => {
     const content: string = event.data as string
     console.log(content)

     if(JSON.parse(content) === "token exp"){
         console.log("token expired")
         console.log(get(tokenExpired))
         messageWS.send(await getToken())
         console.log("new token sent")
     } else {
         processEvent(event)
     }
  }

  messageWS.onclose = () => {
      console.log("ws connection closed")
  }


}

const stopListeningForMessagesWS = async () => {
    if(messageWS)
        messageWS.close()
}

const stopListeningForMessages = async () => {
    messageEventSource.close()
}

const refreshEventSource = async () => {
    console.log("Refreshing remote event source")
    await stopListeningForMessages()
    listenForMessages()
}

const processEvent = (event) => {

    topic = get(viewedTopic)
    console.log(event)

    if(!topic)
        return
        
    const message = JSON.parse(event.data) as Message
    console.log(message)
    if(message.to == topic.title){

        _messages.update((messages) => {

            for(let m of messages) {
                if(m.id == message.id){
                    return messages
                }
            }

            return [...messages, message]
        })

    }
    
}

const sendMessage = async (messageData: SendMessageDTO) => {
    return MessagesAPI.sendMessage(messageData, await getToken())
}

export {
    messages,
    fetchMessages,
    listenForMessages,
    listenForMessagesWS,
    stopListeningForMessages,
    stopListeningForMessagesWS,
    refreshEventSource,
    sendMessage
}