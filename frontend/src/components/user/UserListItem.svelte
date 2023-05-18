<script lang="ts">
import type { User } from "../../domain/user";
import {link} from "svelte-routing";

    export let user: User
</script>

<li class="block p-0">
    <div class="box has-background-light">
        <div class="levels">
            <div class="level-left">
                <p class="content">{user.username}</p>
            </div>
    
            <div class="level-right">
                <a class="button is-small is-rounded is-link" href="{`/user/${user.username}`}" use:link>topics</a>
            </div>
        </div>
    </div>
    
</li>
