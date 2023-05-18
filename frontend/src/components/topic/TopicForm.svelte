<script lang="ts">
    import type { NewTopicDTO } from "../../dtos/NewTopicDTO";
    import { createEventDispatcher } from "svelte";

    let topicData = { title: "", public: false, password: "" } as NewTopicDTO;
    const dispatch = createEventDispatcher();
    $: validTopic = topicData.public || topicData.password.length >= 12;

    export let handlingEvent: boolean = false;
    
    let isLoadingClass: string = "";

    $: {
        isLoadingClass = handlingEvent ? "is-loading" : ""
    }

    function createTopic() {
        dispatch("create-topic", topicData);
    }
</script>

<div class="columns">
    <div class="column is-6 is-offset-3">
        <div class="box my-5">
            <form on:submit|preventDefault={createTopic}>
                <div class="field">
                    <label class="label" for="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        class="input"
                        placeholder="Title of the topic"
                        bind:value={topicData.title}
                    />
                </div>

                <div class="field levels">
                    <label class="label" for="public">Public</label>
                    <input
                        type="checkbox"
                        name="public"
                        id="public"
                        class="checkbox"
                        bind:checked={topicData.public}
                    />
                </div>


                {#if !topicData.public}
                    <div class="field">
                        <label class="label" for="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            class="input"
                            placeholder="Password for other users to access the topic"
                            bind:value={topicData.password}
                        />
                    </div>
                   
                {/if}
                <button class={`button is-primary ${isLoadingClass}`} type="submit" disabled={!validTopic || handlingEvent}
                    >Create Topic</button
                >
            </form>
        </div>
    </div>
</div>
