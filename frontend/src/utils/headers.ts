export function tokenAuthHeader(token: string) {
    return {
        'Authorization': 'Bearer ' + token
    }
}