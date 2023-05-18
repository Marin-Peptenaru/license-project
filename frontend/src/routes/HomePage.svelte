<script lang="ts">
    import UserDetails from "../components/user/UserDetails.svelte";

    let homepage = 'This is the homepage';

    import {user, fetchUserDetails} from "../state/user";
    import {isAuthenticated} from "../state/auth";
    import {subscribedTopics, createdTopics, fetchCreatedTopics, fetchSubscribedTopics } from "../state/topics"

    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";

    onMount(() => {
        if($isAuthenticated){
            fetchUserDetails()
            fetchSubscribedTopics()
            fetchCreatedTopics()
        }
    })

    $: currentUser = $user
    $: subTopics = $subscribedTopics
    $: userTopics = $createdTopics 

    function goToNewTopicPage(){
        navigate("/topics/create")
    }

    
</script>
<div class="content">
    <h1>
        {homepage}
    </h1>
    
    <button class="button is-primary" on:click="{goToNewTopicPage}">Create a topic</button>
</div>

<UserDetails user={currentUser} subscribedTopics={subTopics} createdTopics={userTopics}/>


