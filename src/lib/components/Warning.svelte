<script>
	export let title;
	export let text;
</script>

<div class="wrapper">
  <h3 class="title">{title}</h3>
  <p class="text">{text}</p>
</div>

<style>
  .wrapper {
    padding: 12px 16px;
    border-radius: 4px;
    background-color: #ffe6aa;
    margin: 0 8px;
  }

  .title {
    font-size: 1rem;
    margin: 10px 0;
  }

  .text {
    font-size: 0.9rem;
    margin: 6px 0;
  }
</style>