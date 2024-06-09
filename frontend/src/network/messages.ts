import axios from "axios";
import { Message } from "../domain/message";
import { formatDate } from "../utils/date";
import { messages, messageSend, messageStream } from "../utils/endpoints";
import { tokenAuthHeader } from "../utils/headers";
import {EventSourcePolyfill} from "event-source-polyfill";
import type { SendMessageDTO } from "../dtos/SendMessageDTO";
import { MessageFilter } from "../dtos/filters/message-filter";


export namespace MessagesAPI {

    export async function fetchMessages(filter: MessageFilter, token: string): Promise<Message[]> {
        return axios.get(messages, {
            headers: {
                ...tokenAuthHeader(token),
            },
            params: filter
        }).then((res) => {
            return res.data as Message[]
        }).catch((err) => {
            console.log(err)
            return []
        })
    }

    export async function messagesSource(token: string){
        return new EventSourcePolyfill(messageStream, {
            headers: {
                ...tokenAuthHeader(token)
            }
        })       
    }

    export async function listenForMessagesWS(token: string){
        return new WebSocket("ws://localhost:8081/api/messages/stream/?auth="+token,)
    }

    export async function sendMessage(messageData: SendMessageDTO, token: string){
        return axios.post(messageSend, messageData, {
           headers: {
            ...tokenAuthHeader(token)
           } 
        }).then((res) => {
            return res.data as Message
        }).catch((err) => {
            console.log(err)
            return new Message()
        })
    }
}