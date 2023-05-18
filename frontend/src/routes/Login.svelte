<script lang="ts">
    import { onMount } from "svelte";

    import { navigate } from "svelte-routing";
    import { isAuthenticated } from "../state/auth";

    let username = "";
    let password = "";
    let authenticating: boolean = false;

    let isLoadingClass: string = "";

    $: {
        isLoadingClass = authenticating ? "is-loading" : "";
    }
    import { login } from "../state/auth";

    const goToHomePage = () => {
        navigate("/", { replace: true });
    };

    const authenticate = () => {
        login(username, password).then((authenticated) => {
            if (authenticated) goToHomePage();
        });
    };

    onMount(() => {
        if ($isAuthenticated) goToHomePage();
    });
</script>

<div class="container">
    <div class="columns is-centered">
        <div class="column is-narrow is-vcentered">
            <div class="box is-rounded">
                <form on:submit|preventDefault={authenticate}>
                    <div class="block field">
                        <label class="label" for="username">Username</label>
                        <div class="control">
                            <input
                                class="input"
                                type="text"
                                name="username"
                                id="username"
                                bind:value={username}
                                placeholder="Type username..."
                            />
                        </div>
                    </div>

                    <div class="block field">
                        <label class="label" for="password">Password</label>
                        <div class="control">
                            <input
                                class="input"
                                type="password"
                                name="password"
                                id="password"
                                bind:value={password}
                                placeholder="Type password..."
                            />
                        </div>
                    </div>

                    <button
                        class={`button is-primary ${isLoadingClass}`}
                        type="submit"
                        disabled={authenticating}>Log in</button
                    >
                </form>
            </div>
        </div>
    </div>
</div>
