import axios from "axios";
import { User } from "../domain/user";
import { tokenAuthHeader } from "../utils/headers";
import { users } from "../utils/endpoints";
import { user } from "../state/auth";


export namespace UserApi {

    export async function getUserDetails(token: string): Promise<User>{
        return axios.get(users, {
            headers: {
                ...tokenAuthHeader(token),
            }
        }).then((res) => {
            return res.data as User
        }).catch((err) => {
            console.log(err)
            return new User()
        })
    }

    export async function searchUsersByUsername(searchKey: string, token: string): Promise<User[]> {
        console.log(users)
        return axios.get(users + `/search/${searchKey}`, {
            headers: {
                ...tokenAuthHeader(token)
            }
        }).then((res) => {
            return res.data as User[]
        }).catch((err) => {
            console.log(err)
            return []
        })


    }
}