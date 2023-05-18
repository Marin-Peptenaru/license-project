<script lang="ts">
	import { Router, Route, Link } from "svelte-routing";
	import HomePage from "./routes/HomePage.svelte";
	import TopicDetailsPage from "./routes/TopicDetailsPage.svelte";
	import NewTopic from "./routes/NewTopic.svelte";
	import Login from "./routes/Login.svelte";
	import Secure from "./routes/Secure.svelte";

	const url = "";

	import { isAuthenticated, logout } from "./state/auth";
	import TopicsOfUserPage from "./routes/TopicsOfUserPage.svelte";
</script>

<main>
	<Router {url}>
		{#if $isAuthenticated}
			<div class="hero box is-link is-small mx-0  py-0 is-rounded">
				<div class="hero-body">
					<div class="level">
						<div class="level-left">
							<nav class="breadcrumb" aria-label="breadcrumbs">
								<ul>
									<li><Link to="login">Login</Link></li>
									<li><Link to="/">Home</Link></li>
								</ul>
							</nav>
						</div>
						<div class="level-right">
							<button
								class="button is-light is-outlined"
								on:click={logout}>Logout</button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div>
			<Route path="login" component={Login} />
			<Route path="topics/create">
				<Secure>
					<NewTopic />
				</Secure>
			</Route>
			<Route path="topics/:id" let:params>
				<Secure>
					<TopicDetailsPage topicId={params.id} />
				</Secure>
			</Route>
			<Route path="user/:username" let:params>
				<Secure>
					<TopicsOfUserPage username={params.username} />
				</Secure>
			</Route>
			<Route path="/">
				<Secure>
					<HomePage />
				</Secure>
			</Route>
		</div>
	</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
