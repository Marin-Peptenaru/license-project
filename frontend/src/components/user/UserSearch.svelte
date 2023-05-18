<script lang="ts">
    import type { User } from "../../domain/user";
    import { searchUsersByUsername } from "../../state/user";
    import LoadingBar from "../utils/LoadingBar.svelte";
    import ThrottledSearchField from "../utils/ThrottledSearchField.svelte";
    import UserList from "./UserList.svelte";

    let searchingUsers: Promise<User[]> = undefined;

    const searchUserHandler = (event) => {
        const searchKey: string = event.detail;

        searchingUsers = searchUsersByUsername(searchKey);
    };
</script>

<ThrottledSearchField
    placeholder="Search users by username"
    on:search={searchUserHandler}
/>

{#if searchingUsers}
    <div class="block">
        {#await searchingUsers}
            <LoadingBar />
        {:then users}
            <UserList {users} />
        {/await}
    </div>
{/if}
