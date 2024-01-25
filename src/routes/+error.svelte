<script>
	import { page } from '$app/stores';
</script>

<div class="wrapper">
	<h1 class="status">{$page.error?.statusCode || ""} {$page.error?.statusText || ""}</h1>
	<p class="message">{$page.error?.message} </p>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100%;
		padding: 16px;
	}
	.status {
		font-size: 2rem;
		margin: 0;
	}
	.message {
		font-size: 1.5rem;
	}
</style>