<script lang="ts">
    import { createEventDispatcher } from "svelte";

    enum Options {
        today,
        thisMonth,
        thisYear,
        all,
    }

    const event: string = "filter-change";
    let selectedOption = Options.today;

    const dispatch = createEventDispatcher();

    $: {
        let date = new Date();

        if (selectedOption == Options.thisMonth) {
            date.setDate(1);
        }

        if (selectedOption == Options.thisYear) {
            date.setDate(1);
            date.setMonth(0);
        }

        if (selectedOption == Options.all) {
            date = new Date(0);
        }
        console.log(selectedOption)
        console.log(date)
        dispatch(event, date);
    }
</script>

<div class="field">
    <label for="after" class="label" />
    <select name="after" id="after" class="select" bind:value={selectedOption}>
        <option value={Options.today}>Today</option>
        <option value={Options.thisMonth}>This Month</option>
        <option value={Options.thisYear}>This Year</option>
        <option value={Options.all}>All</option>
    </select>
</div>
