<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import type { User } from "../../domain/user";
    import type { SendMessageDTO } from "../../dtos/SendMessageDTO";

    import { viewedTopic } from "../../state/topics";

    import { messages, fetchMessages } from "../../state/messages";
    import MessageForm from "../message/MessageForm.svelte";
    import MessageList from "../message/MessageList.svelte";
    import TopicInfo from "./TopicInfo.svelte";
    import { sendMessage } from "../../state/messages";
    import SubscriptionToggler from "./SubscriptionToggler.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import MessageTimeFilter from "../message/MessageTimeFilter.svelte";

    export let topic: Topic;
    export let user: User;

    let subscribed: boolean;
    let isAdmin: boolean;
    let fetchingMessages: Promise<void>;
    let after: Date = new Date()

    let sendingMessage: boolean = false;

    $: {
        subscribed = user.topics && user.topics[topic.title];
    }

    $: {
        isAdmin = user.username === topic.admin;
    }

    $: {
        if (subscribed || isAdmin) {
            fetchingMessages = fetchMessages(topic.title, after);
        }
    }

    function send(event) {
        const messageData = event.detail as SendMessageDTO;
        messageData.topic = $viewedTopic.id;
        sendingMessage = true;
        sendMessage(messageData).then((_) => {
            sendingMessage = false;
        });
    }

    function changeAfter(event) {
        after = event.detail as Date
    }
</script>

<div class="columns my-5">
    <div class="column is-3">
        <div class="box">
            <TopicInfo {topic} />

            {#if !isAdmin}
                <MessageTimeFilter on:filter-change="{changeAfter}" />
                <SubscriptionToggler {user} {topic} />
            {/if}
        </div>
    </div>

    <div class="column is-offset-1 is-narrow">
        <div class="box is-flex">
            {#if isAdmin || subscribed}
                {#await fetchingMessages}
                    <LoadingSpinner />
                {:then _}
                    <MessageList messages={$messages} />
                {/await}
            {/if}

            {#if isAdmin}
                <MessageForm
                    handlingEvent={sendingMessage}
                    on:send-message={send}
                />
            {/if}
        </div>
    </div>
</div>
