<script lang="ts">
    import {isAuthenticated} from "../state/auth"

    import {navigate} from "svelte-routing";

    
    $: if(!$isAuthenticated){
        navigate("/login", {replace: true})
    }



</script>

<div>
    <slot></slot>
</div>