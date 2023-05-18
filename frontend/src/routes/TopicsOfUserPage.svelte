<script lang="ts">
    import { onMount } from "svelte";
    import TopicList from "../components/topic/TopicList.svelte";
    import LoadingSpinner from "../components/utils/LoadingSpinner.svelte";
    import type { Topic } from "../domain/topic";
    import { fetchTopicsOf } from "../state/topics";

    export let username: string;
    let fetchingTopicsCreatedByUser: Promise<Topic[]>;

    onMount(() => {
        fetchingTopicsCreatedByUser = fetchTopicsOf(username);
    });
</script>

<div class="box">
    <div class="block">Topics created by {username}</div>
    <div class="block">
        {#await fetchingTopicsCreatedByUser}
            <LoadingSpinner />
        {:then topics}
            <TopicList {topics} />
        {/await}
    </div>
</div>
