<script lang="ts">
    import { link } from "svelte-routing";
    import type { Topic } from "../../domain/topic";

    export let topic: Topic;

    let colorClass: string = topic.public ? "has-background-success" : "has-background-light"
    console.log(colorClass);

    let publicOrPrivate: string = topic.public ? "public" : "private"
    let publicOrPrivateTagColor: string = topic.public ? "is-light" : "is-dark"
</script>

<li class="block p-0">
    <div class={"box " + colorClass}>
        <div class="levels">
            <div class="level-left">
                <div class="is-flex is-flex-direction-column is-justify-content-space-around">
                        <p>{topic.title}</p>
                        <span class="{`tag ${publicOrPrivateTagColor} is-rounded my-2`}">
                                {publicOrPrivate}
                        </span>      
                </div>
                        
            </div>
            <div class="level-right">
                <a
                    class="button is-link is-small is-rounded"
                    href={`/topics/${topic.id}`}
                    use:link>details</a
                >
            </div>
        </div>
    </div>
</li>
