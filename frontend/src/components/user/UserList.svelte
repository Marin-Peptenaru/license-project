<script lang="ts">
    import type { User } from "../../domain/user";
    import UserListItem from "./UserListItem.svelte";

    export let users: User[] = [];
</script>

{#if users.length}
    <ul class="scroll-box">
        {#each users as user (user.id)}
            <UserListItem {user} />
        {/each}
    </ul>
{:else}
    <div class="container">
        <p class="content">No users to display</p>
    </div>
{/if}
