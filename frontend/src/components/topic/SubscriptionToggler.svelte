<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import type { User } from "../../domain/user";
    import type { SubscribeDTO } from "../../dtos/SubscribeDTO";
    import { subscribeToTopic, unsubscribeToTopic } from "../../state/topics";

    export let topic: Topic;
    export let user: User;

    let subscribed: boolean;
    let changingSubscriptionStatus: boolean = false;
    let subscribeData = { id: topic.id, password: "" } as SubscribeDTO;
    let loadingButtonClass: string;

    $: {
        loadingButtonClass = changingSubscriptionStatus ? "is-loading" : "";
    }

    function subscribe() {
        changingSubscriptionStatus = true;
        subscribeToTopic(subscribeData).then((_) => {
            changingSubscriptionStatus = false;
        });
    }

    function unsubscribe() {
        changingSubscriptionStatus = true;
        unsubscribeToTopic(topic.title).then((_) => {
            changingSubscriptionStatus = false;
        });
    }

    $: {
        subscribed = user.topics[topic.title];
    }
</script>

<div>
    {#if !topic.public}
        <label for="password">Topic password</label>
        <input
            type="password"
            name="password"
            id="password"
            placeholder="Insert topic password..."
            bind:value={subscribeData.password}
        />
    {/if}

    {#if subscribed}
        <button
            class={`button is-primary is-outlined ${loadingButtonClass}`}
            on:click={unsubscribe}
            disabled={changingSubscriptionStatus}>Unsubscribe</button
        >
    {:else}
        <button
            class={`button is-primary ${loadingButtonClass}`}
            on:click={subscribe}
            disabled={changingSubscriptionStatus}>Subscribe</button
        >
    {/if}
</div>
