<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SendMessageDTO } from "../../dtos/SendMessageDTO";

    let messageData = { topic: "", content: "" } as SendMessageDTO;
    let messageIsValid: boolean = false;
    $: messageIsValid = messageData.content.length > 10;
    const dispatch = createEventDispatcher();

    export let handlingEvent: boolean = true;

    let isLoadingClass = "";

    $: {
        isLoadingClass = handlingEvent ? "is-loading" : "";
    }

    function sendMessage() {
        dispatch("send-message", messageData);
    }
</script>

<form on:submit|preventDefault={sendMessage}>
    <div class="field">
        <textarea
            class="textarea"
            name="message"
            id="message"
            cols="100"
            rows="5"
            bind:value={messageData.content}
            placeholder="Message text content"
        />
        <div class="levels my-2">
            <div class="level-right">
                <div class="level-item">
                    <button
                    class="{`button is-primary ${isLoadingClass}`}"
                    type="submit"
                    disabled={!messageIsValid || handlingEvent}>Send</button
                    >
                </div>
            </div>
        </div>
       
    </div>
</form>
