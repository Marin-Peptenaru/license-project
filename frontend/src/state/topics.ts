import { navigate } from "svelte-routing";
import { derived, writable, get } from "svelte/store";
import type { Topic } from "../domain/topic";
import type { NewTopicDTO } from "../dtos/NewTopicDTO";
import type { SubscribeDTO } from "../dtos/SubscribeDTO";
import { TopicsApi } from "../network/topic";
import {fetchUserDetails} from "../state/user"
import { refreshEventSource } from "./messages";
import { getToken, token } from "./auth";

const _subscribedTopics = writable([] as Topic[])
const _createdTopics = writable([] as Topic[])
const _viewedTopic = writable<Topic>(undefined)
const viewedTopic = derived(_viewedTopic, $topic => $topic)

const subscribedTopics = derived(_subscribedTopics, $_subsribedTopics => $_subsribedTopics)
const createdTopics = derived(_createdTopics, $_createdTopics => $_createdTopics)

const createTopic = async (topicData: NewTopicDTO) => {
    TopicsApi.createTopic(topicData, await getToken())
    .then((topic) => {
        navigate(`/topics/${topic.id}`)
    })
}

const searchForTopics = async (searchKey: string) => {
    return TopicsApi.searchTopics(searchKey, await getToken() )
}

const fetchSubscribedTopics = async () => {
    TopicsApi.getSubscribedTopics(await getToken())
    .then((topics) => {
        _subscribedTopics.set(topics)
        console.log(topics)
    })
}

const fetchTopicsOf = async (username: string) => {
    return TopicsApi.getTopicsCreatedBy(username, await getToken())
}

const fetchCreatedTopics = async () => {
    TopicsApi.getCreatedTopics(await getToken())
    .then((topics) => {
        _createdTopics.set(topics)
        console.log(topics)
    })
}

const fetchTopicDetails = async (topicId: string) => {
    TopicsApi.getTopicDetails(topicId, await getToken()).then((topic) => {
        _viewedTopic.set(topic)
    })
}

const subscribeToTopic = async (subscribeData: SubscribeDTO) => {
    TopicsApi.subscribeToTopic(subscribeData, await getToken()).then((subscribed) => {
        if(subscribed){
            fetchUserDetails()
            //refreshEventSource()
        }
    })
}

const unsubscribeToTopic = async (topicTitle: string) => {
    TopicsApi.unsubscribeToTopic(topicTitle, await getToken()).then((unsubscribed) => {
        if(unsubscribed){
            fetchUserDetails()
            //refreshEventSource()
        }
    })
}

export {
    subscribedTopics,
    createdTopics,
    viewedTopic,
    fetchSubscribedTopics,
    fetchCreatedTopics,
    fetchTopicDetails,
    createTopic,
    subscribeToTopic,
    unsubscribeToTopic,
    searchForTopics,
    fetchTopicsOf
}
