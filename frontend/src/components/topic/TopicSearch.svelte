<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import { searchForTopics } from "../../state/topics";
    import LoadingBar from "../../components/utils/LoadingBar.svelte";
    import TopicList from "./TopicList.svelte";
    import ThrottledSearchField from "../utils/ThrottledSearchField.svelte";


    let searchingTopics: Promise<Topic[]> = undefined;

    const searchTopicsHandler = (event) => {
        const topicSearchKey = event.detail as string;
        searchingTopics = searchForTopics(topicSearchKey);
    };
</script>

<ThrottledSearchField
    placeholder="Search by topic title"
    on:search={searchTopicsHandler}
/>

{#if searchingTopics}
    <div class="block">
        {#await searchingTopics}
            <LoadingBar />
        {:then topics}
            <TopicList {topics} />
        {/await}
    </div>
{/if}
