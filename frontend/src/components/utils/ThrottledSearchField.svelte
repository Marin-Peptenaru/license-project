<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let searchKey: string = "";
    export let throttleTime: number = 500;
    export let placeholder: string = ""
    let emitSearchTimer = undefined;

    const emit = createEventDispatcher();

    $: {
        if (searchKey.trimStart().trimEnd().length != 0) {
            if (emitSearchTimer) clearTimeout(emitSearchTimer);

            emitSearchTimer = setTimeout(() => {
                emit("search", searchKey);
            }, throttleTime);
        }
    }
</script>

<p class="control block">
    <input
        type="text"
        class="input"
        placeholder="{placeholder}"
        bind:value={searchKey}
    />
</p>
