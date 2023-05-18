<script lang="ts">
    import { Message } from "../../domain/message";
import { formatDate } from "../../utils/date";

    export let message = new Message();

    let sentAtString: string = formatDate(new Date(message.timestamp * 1000))
    $: {
        sentAtString = formatDate(new Date(message.timestamp * 1000))
    }
</script>

<li>
    <div class="notification my-1">
        <span class="tag is-info">
            {sentAtString}
        </span>
        <div class="content">
            <p>{message.content}</p>
        </div>
    </div>
</li>
