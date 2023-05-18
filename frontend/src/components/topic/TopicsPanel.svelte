<script lang="ts">
    import type { Topic } from "../../domain/topic";
import UserSearch from "../user/UserSearch.svelte";
    import TopicList from "./TopicList.svelte";
    import TopicSearch from "./TopicSearch.svelte";

    enum Tabs {
        subscribed,
        created,
        searchTopics,
        searchUsers,
    }

    export let createdTopics: Topic[];
    export let subscribedTopics: Topic[];

    let tab: Tabs = Tabs.subscribed;
</script>

<div class="tabs">
    <ul>
        <li class:is-active={tab === Tabs.subscribed}>
            <a on:click={() => (tab = Tabs.subscribed)}>Subscribed</a>
        </li>
        <li class:is-active={tab === Tabs.created}>
            <a on:click={() => (tab = Tabs.created)}>Created</a>
        </li>
        <li class:is-active={tab === Tabs.searchTopics}>
            <a on:click={() => (tab = Tabs.searchTopics)}>Search Topics</a>
        </li>
        <li class:is-active={tab === Tabs.searchUsers}>
            <a on:click={() => (tab = Tabs.searchUsers)}>Search Users</a>
        </li>
    </ul>
</div>
<div class="columns">
    <div class="column is-12">
        {#if tab != Tabs.searchTopics && tab != Tabs.searchUsers}
            <TopicList
                topics={tab == Tabs.subscribed
                    ? subscribedTopics
                    : createdTopics}
            />
        {:else}
                    {#if tab == Tabs.searchTopics}
                    <TopicSearch />
                    {/if}
                    {#if tab == Tabs.searchUsers}
                    <UserSearch />
                    {/if}

        {/if}
    </div>
</div>
