<script lang="ts">
    import type { Topic } from "../../domain/topic";
    import type { User } from "../../domain/user";

    import TopicList from "../topic/TopicList.svelte";
    import TopicsPanel from "../topic/TopicsPanel.svelte";

    export let user: User;
    export let subscribedTopics: Topic[];
    export let createdTopics: Topic[];
</script>

<div class="columns">
    <div class="column is-2">
        <div class="box is-rounded px-3">
            <div class="content">
                <div class="block">
                    <p>
                        Username: {user.username}
                    </p>
                </div>

                <div class="block">
                    <p>
                        Email: {user.email}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="column is-8 is-offset-1">
        <TopicsPanel {createdTopics} {subscribedTopics}></TopicsPanel>
    </div>
</div>

