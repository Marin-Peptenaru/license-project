<script lang="ts">
    import type { Message } from "../../domain/message";
    import MessageListItem from "./MessageListItem.svelte";

    export let messages: Message[] = [];
</script>

{#if messages.length}
    <ul class="scroll-box">
        {#each messages as message (message.id)}
            <MessageListItem {message} />
        {/each}
    </ul>
{:else}
    <div class="container">
        <p class="content">
            No messages to display
        </p>
    </div>
{/if}
