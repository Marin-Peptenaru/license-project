import axios from "axios"
import type { TokenDTO } from "../dtos/TokenDTO"
import { auth } from "../utils/endpoints"
import { tokenAuthHeader } from "../utils/headers"

export namespace AuthApi {

    export async function login(username: string, password: string): Promise<TokenDTO> {
        return axios.post(auth, {
            username, password
        }).then((res) => {
            return res.data as TokenDTO
        })
    }

    export async function logout(refreshToken: string): Promise<boolean> {
        return axios.put(auth + '/logout', {}, {
            headers: {
                ...tokenAuthHeader(refreshToken)
            }
        })
            .then((_) => true)
            .catch((_) => false)
    }

    export async function refresh(refreshToken: string): Promise<string> {
        return axios.post(auth + '/refresh', {}, {
            headers: {
                ...tokenAuthHeader(refreshToken)
            }
        }).then((res) => res.data as string)
            .catch((err) => {
                console.log(err)
                return ""
            })
    }
}
