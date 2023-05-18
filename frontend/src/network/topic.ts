import axios, { AxiosError } from "axios";
import { Topic } from "../domain/topic";
import type { NewTopicDTO } from "../dtos/NewTopicDTO";
import type { SubscribeDTO } from "../dtos/SubscribeDTO";
import { topics, subscribe, unsubscribe} from "../utils/endpoints";
import { tokenAuthHeader } from "../utils/headers";

export namespace TopicsApi {

    async function getTopics(url: string, token: string): Promise<Topic[]> {
        return axios.get(url, {
            headers: {
                ...tokenAuthHeader(token),
            }
        }).then((res) => {
            return res.data as Topic[]
        }).catch((err) => {
            console.log(err)
            return []
        })
    }

    export async function createTopic(topicData: NewTopicDTO, token: string) {
        return axios.post(topics, topicData, {
            headers: {
                ...tokenAuthHeader(token)
            }
        }).then((res) => {
            return res.data as Topic
        }).catch((err) => {
            console.log(err)
            return new Topic()
        })
    }

    export async function subscribeToTopic(subscribeData: SubscribeDTO, token: string ) {
        return axios.put(subscribe, subscribeData, {
            headers: {
                ...tokenAuthHeader(token)
            }
        }).then((res) => {
            return true
        }).catch((err) =>{
            console.log(err)
            return false
        })
    }

    export async function unsubscribeToTopic(topicTitle: string, token: string){
        return axios.put(unsubscribe, {title: topicTitle}, {
            headers: {
                ...tokenAuthHeader(token)
            }
        }).then((res) => {
            return true
        }).catch((err) => {
            console.log(err)
            return false
        })
    }

    export async function searchTopics(searchKey: string, token: string): Promise<Topic[]> {
        return axios.get(topics + `/search/${searchKey}`, {
            headers: {
                ...tokenAuthHeader(token),
            },
            params: {
                search: searchKey
            }
        }).then((res) => {
            return res.data as Topic[]
        }).catch((err) => {
            console.log(err)
            return []
        })
    }

    export async function getSubscribedTopics(token: string): Promise<Topic[]> {
        return getTopics(topics + "/subscribed", token)
    }

    export async function getCreatedTopics(token: string): Promise<Topic[]> {
        return getTopics(topics, token)
    }

    export async function getTopicsCreatedBy(username: string, token: string): Promise<Topic[]> {
        return getTopics(topics + `/of/${username}`, token)
    }

    export async function getTopicDetails(topicId: string, token: string): Promise<Topic> {
        return axios.get(topics + `/${topicId}`, {
            headers: {
                ...tokenAuthHeader(token)
            }
        }).then((res) => {
            return res.data as Topic
        }).catch((err) => {
            console.log(err)
            return new Topic()
        })
    }
}