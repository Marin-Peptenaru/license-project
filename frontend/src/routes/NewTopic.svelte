<script lang="ts">
    import TopicForm from "../components/topic/TopicForm.svelte";
    import type { NewTopicDTO } from "../dtos/NewTopicDTO";
    import {createTopic} from "../state/topics";

    function createNewTopic(event) {
        const topicData = event.detail as NewTopicDTO
        console.log('make network call to create topic')
        console.log(topicData)
        createTopic(topicData)
    }


</script>

<TopicForm on:create-topic={createNewTopic}>

</TopicForm>

