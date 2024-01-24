<script>
	import { getUniqueObjectValues, sortVersions, calculateDaysPercentage } from '$lib/helpers/helperFunctions';
	import { OPTION_ALL } from '$lib/helpers/data';
	import Table from '$lib/components/Table.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Filters from '$lib/components/Filters.svelte';

	const CHART_VIEW = 'chart';
	const TABLE_VIEW = 'table';

	export let data;
	let { games, retention } = data;

	let selectedGame = OPTION_ALL.game;
	let selectedVersion = OPTION_ALL.version;
	let selectedCountry = OPTION_ALL.country;
	let dataView = CHART_VIEW;

	const uniqueDataOptions = {
		gameIds: games.map((game) => game.app_id),
		versions: getUniqueObjectValues(retention, 'app_ver'),
		countries: getUniqueObjectValues(retention, 'country')
	};

	$: filterBy = {
		gameId:
			!selectedGame || selectedGame?.app_id === OPTION_ALL.game.app_id
				? uniqueDataOptions.gameIds
				: [selectedGame?.app_id],
		version:
			!selectedVersion || selectedVersion?.value === OPTION_ALL.version.value
				? uniqueDataOptions.versions
				: [selectedVersion?.value],
		country:
			!selectedCountry || selectedCountry?.value === OPTION_ALL.country.value
				? uniqueDataOptions.countries
				: [selectedCountry?.value]
	};

	const getDataToDisplay = (data) => {
		const sorted = sortVersions(data, 'app_ver');
		const calculated = sorted.map((item) => {
			return {
				...item,
				days: calculateDaysPercentage(item.days)
			};
		});

		return calculated;
	};

	$: filteredRetentionData = retention.filter((item) => {
		return (
			filterBy.gameId.includes(item.app_id) &&
			filterBy.version.includes(item.app_ver) &&
			filterBy.country.includes(item.country)
		);
	});

	$: dataToDisplay = getDataToDisplay(filteredRetentionData);

	// beforeUpdate(() =>
	// 	console.log('updated')
	// )
</script>

<Filters {games} {retention} {filterBy} bind:selectedGame bind:selectedCountry bind:selectedVersion />

<div>
	<h2>VIEW BAR - table or chart option</h2>
	<button on:click={() => (dataView = TABLE_VIEW)}>Table</button>
	<button on:click={() => (dataView = CHART_VIEW)}>Chart</button>
	<p>Showing: {dataView}</p>
</div>

<div>
	<h2>CONTENT</h2>
	{#if dataView === TABLE_VIEW}
		<Table 
			retention={dataToDisplay}
			multipleGamesSelected={selectedGame.app_id === OPTION_ALL.game.app_id}
		/>
	{:else}
		<Chart
			retention={dataToDisplay}
			multipleGamesSelected={selectedGame.app_id === OPTION_ALL.game.app_id}
		/>
	{/if}
</div>
