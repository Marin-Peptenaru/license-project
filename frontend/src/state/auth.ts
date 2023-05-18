import { derived, get, writable } from "svelte/store";
import { secureStorage } from "../utils/storage";
import { AuthApi } from "../network/auth";
import {navigate} from "svelte-routing";
import { listenForMessages, listenForMessagesWS, stopListeningForMessages, stopListeningForMessagesWS } from "./messages";
import type { AxiosError } from "axios";
import jwtDecode from "jwt-decode";


const _token = writable("", (set) => {
    set(secureStorage.get("token") as string)
})

const _username = writable("", (set) => {
    set(secureStorage.get("username") as string)
})

const _refreshToken = writable("", (set) => {
    set(secureStorage.get("refresh") as string)
})

let logoutTimer = undefined

const token = derived(_token, $_token => $_token)
const username = derived(_username, $_username => $_username)
const isAuthenticated = derived(_refreshToken, $_token => $_token !== "")

const tokenExpired = derived(_token, $_token => {
    const claims = jwtDecode($_token)
    return claims["exp"] <= Date.now() / 1000
})

const login = async (username: string, password: string) => {
    return AuthApi.login(username, password)
    .then((tokens) => {
        _token.set(tokens.auth)
        _username.set(username)
        _refreshToken.set(tokens.refresh)
        secureStorage.set("token", tokens.auth)
        secureStorage.set("refresh", tokens.refresh)
        secureStorage.set("username", username)
        listenForMessages()
        listenForMessagesWS()
        navigate("/", {replace: true})

        const refreshTokenClaims = jwtDecode(tokens.refresh)

        // logout one minute before the the refresh token expires so it is removed from the server and is no longer valid
        logoutTimer = setTimeout(logout, refreshTokenClaims["exp"] * 1000 - Date.now() - 60 * 1000)
        return true
    })
    .catch((err: AxiosError) => {
        console.log(err)
        return false
    });
}

const logout = async () => {
    stopListeningForMessages()
    stopListeningForMessagesWS()
    AuthApi.logout(get(_refreshToken) as string)
    secureStorage.remove("token")
    secureStorage.remove("user")
    secureStorage.remove("refresh")
    _token.set("");
    _username.set("");
    _refreshToken.set("")
    if(logoutTimer)
        clearTimeout(logoutTimer)
    navigate("/login", {replace: true})
}

let newTokenPromise: Promise<string> = undefined
let refreshing: boolean = false

const getToken = async (): Promise<string> => {

    if(get(tokenExpired)) {
        
        if(!refreshing){
            refreshing = true
            newTokenPromise = AuthApi.refresh(get(_refreshToken)).then((token) => {
                refreshing = false
                return token
            })
        }
        
        const newToken = await newTokenPromise
        secureStorage.set("token", newToken)
        _token.set(newToken)
    }

    return get(_token)
   
}

export {
    token,
    username as user,
    isAuthenticated, 
    tokenExpired,
    login,
    logout,
    getToken
}