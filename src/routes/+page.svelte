<script>
	import {
		getUniqueObjectValues,
		sortVersions,
		calculateDaysPercentage
	} from '$lib/helpers/helperFunctions';
	import { OPTION_ALL } from '$lib/helpers/data';
	import Table from '$lib/components/Table.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import Button from '$lib/components/Button.svelte';
	import Warning from '$lib/components/Warning.svelte';

	const CHART_VIEW = 'chart';
	const TABLE_VIEW = 'table';

	export let data;
	let { games, retention } = data;

	let selectedGame = OPTION_ALL.game;
	let selectedVersion = OPTION_ALL.version;
	let selectedCountry = OPTION_ALL.country;
	let dataView = TABLE_VIEW;

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

</script>

<div class="wrapper">
	<h1>Filter data</h1>

	<Filters
		{games}
		{retention}
		{filterBy}
		bind:selectedGame
		bind:selectedCountry
		bind:selectedVersion
	/>

	<div class="button-wrapper">
		<Button 
			handleClick={() => (dataView = TABLE_VIEW)}
			selected={dataView === TABLE_VIEW}
		>
			Table
		</Button>
		<Button 
			handleClick={() => (dataView = CHART_VIEW)}
			selected={dataView === CHART_VIEW}
		>
			Chart
		</Button>
	</div>

	<div class="content-wrapper">
		{#if selectedGame?.app_id === OPTION_ALL.game.app_id}
			<Warning 
				title="! Multiple Games are selected"
				text="You might see some version and country duplicates, but each of them represents a different game"
			/>
		{/if}

		{#if dataView === TABLE_VIEW}
			<Table retention={dataToDisplay} />
		{:else}
			<Chart retention={dataToDisplay} />
		{/if}
	</div>
</div>

<style>
	.wrapper {
		padding: 24px;
	}

	.button-wrapper {
		display: flex;
		flex-wrap: wrap;
		margin: 12px 8px;
	}

	.content-wrapper {
		margin-top: 36px;
	}
</style>
