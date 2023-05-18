<script lang="ts">
    import { onMount } from "svelte";
    import TopicDetails from "../components/topic/TopicDetails.svelte";

    import { user, fetchUserDetails } from "../state/user";
    import { viewedTopic, fetchTopicDetails } from "../state/topics";
    import LoadingSpinner from "../components/utils/LoadingSpinner.svelte";

    export let topicId: string;
    let dataFetched: Promise<any>;

    onMount(() => {
        dataFetched = Promise.all([
            fetchTopicDetails(topicId),
            fetchUserDetails(),
        ]);
    });
</script>

{#await dataFetched}
    <LoadingSpinner />
{:then _}
    {#if $viewedTopic}
        <TopicDetails topic={$viewedTopic} user={$user} />
    {/if}
{/await}
