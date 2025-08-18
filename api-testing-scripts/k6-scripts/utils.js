import http from 'k6/http'

export const headers = {
    'Content-Type': 'application/json',
}

export const url = 'http://localhost:8080/api/'
export const endpoints = {
    auth: `${url}auth/`,
    refreshAuth: `${url}auth/refresh/`,
    stream: `${url}messages/stream/,`
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

    return JSON.parse(res.body)
}

export function refreshAuthentication(refreshToken) {
    const res = http.post(endpoints.refreshAuth, {}, {headers: authenticatedHeaders(refreshToken)})

    return res.body
}