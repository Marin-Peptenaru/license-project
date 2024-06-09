import axios from "axios";
import { User } from "../domain/user";
import { tokenAuthHeader } from "../utils/headers";
import { users } from "../utils/endpoints";
import { UserFilter } from "../dtos/filters/user-filter";


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

    export async function searchUsers(filter: UserFilter, token: string): Promise<User[]> {
        console.log(users)
        return axios.get(users + `/search/`, {
            headers: {
                ...tokenAuthHeader(token)
            },
            params: filter
        }).then((res) => {
            return res.data as User[]
        }).catch((err) => {
            console.log(err)
            return []
        })


    }
}