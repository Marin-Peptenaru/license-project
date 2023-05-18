import { derived, writable, get } from "svelte/store";
import { User } from "../domain/user";
import { secureStorage } from "../utils/storage";
import { UserApi } from "../network/user";
import { getToken, token } from "./auth";

const _user = writable(new User(), (set) => {
    const userData = secureStorage.get("user-data")

    if(userData !== '') {
       set(<User>(JSON.parse(userData)))
    }
})

const user = derived(_user, $_user => $_user)


const fetchUserDetails = async () => {
    UserApi.getUserDetails(await getToken()).then((user) => {
        _user.set(user)
        secureStorage.set("user-data", JSON.stringify(user))
        console.log(user)
    })
}

const searchUsersByUsername = async (usernameSearchKey: string) => {
    return UserApi.searchUsersByUsername(usernameSearchKey, await getToken())
}

export {
    user,
    fetchUserDetails,
    searchUsersByUsername,
}