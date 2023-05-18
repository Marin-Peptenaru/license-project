<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import TopicListItem from "../topic/TopicListItem.svelte";

    export let topics: Topic[] = [];
</script>


{#if topics.length}
<ul class="scroll-box">
    {#each topics as topic (topic.id)}
        <TopicListItem {topic} />
    {/each}
</ul>
{:else}
    <div class="container">
        <p class="content">No topics to be displayed</p>
    </div>
{/if}
