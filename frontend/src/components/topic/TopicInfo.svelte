<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import {link} from "svelte-routing";

    export let topic: Topic;
</script>

<div class="content">
    <h1 class="title">{topic.title}</h1>
    <h2 class="subtitle">
        by <a
            class="button is-link is-small is-rounded"
            href={`/user/${topic.admin}`}
            use:link>{topic.admin}</a
        >
    </h2>
    <div class="block">
        {#if topic.public}
            <p>This topic is public</p>
        {:else}
            <p>This topic is private</p>
        {/if}
    </div>
</div>
