import http from 'k6/http'

export const headers = {
    'Content-Type': 'application/json',
}

export const url = 'http://localhost:8888/api/'
export const endpoints = {
    auth: `${url}auth/`,
    refreshAuth: `${url}auth/refresh/`,
    send: `${url}messages/`,
    topics: `${url}topics/`,
}

export function authenticatedHeaders(token) {
    return {
        ...headers,
        'Authorization': `Bearer ${token}`
    }
}

export function authenticate(username, password) {
    const payload = JSON.stringify({
        username, 
        password
    })

    const res = http.post(endpoints.auth, payload, {headers})

    return res.status === 200 ? JSON.parse(res.body) : null
}

export function refreshAuthentication(refreshToken) {
    const res = http.post(endpoints.refreshAuth, {}, {headers: authenticatedHeaders(refreshToken)})

    return res.status === 200 ? res.body : null
}

export function getOwnedTopics(username, token) {
    const res = http.get(`${endpoints.topics}?admin=${username}`, {headers: authenticatedHeaders(token)} )

    if(res.status != 200) {
        console.error("Could not fetch owned topics", res.status, res.body)
        return []
    }

    return JSON.parse(res.body)
}

export function getSubscribedTopics(token) {
    const res = http.get(`${endpoints.topics}subscribed`, {headers: authenticatedHeaders(token)} )

    if(res.status != 200) {
        console.error("Could not fetch subscribed topics", res.status, res.body)
        return []
    }

    return JSON.parse(res.body)
}

export function subscribe(topic, token) {
    console.log("Subscribing to topic:", topic)
    const res = http.put(`${endpoints.topics}subscribe`, JSON.stringify(topic), {headers: authenticatedHeaders(token)})

    if(res.status != 200) {
        console.error("Could not subscribe", res.status, res.body)
    }

    console.log('Now subscribed to: ', getSubscribedTopics(token))
}

export function unsubscribe(topic, token) {
    console.log("Unsubscribing to topic:", topic)
    const res = http.put(`${endpoints.topics}unsubscribe`, JSON.stringify(topic), {headers: authenticatedHeaders(token)})

    if(res.status != 200) {
        console.error("Could not unsubscribe", res.status, res.body)
    }

    console.log('Now subscribed to: ', getSubscribedTopics(token))
}

export class MockSubscriptionHandler {
    constructor(token, vuID) {
        this.token = token
        this.topics = getSubscribedTopics(token)
        this.increment = vuID % 2 == 0 ? 1 : -1
        this.start = vuID % 2 == 0 ? 0 : (this.topics.length -1)
        this.currentIndex = this.start
        this.subscribing = false
    }

    changeSubscriptions() {

        if(__ENV.NO_SUB_CHANGES){
            return
        }

        if(this.subscribing) {
            subscribe(this.topics[this.currentIndex], this.token)
        } else {
            unsubscribe(this.topics[this.currentIndex], this.token)
        }

        this.currentIndex += this.increment

        if(this.currentIndex < 0 || this.currentIndex >= this.topics.length) {
            this.currentIndex = this.start
            this.subscribing = !this.subscribing
        }
    }

    setToken(refreshedToken) {
        this.token = refreshedToken
    }
}