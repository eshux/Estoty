<script>
	import { tick, beforeUpdate } from 'svelte';
	import Svelecte from 'svelecte';
	import {
		getUniqueObjectValues,
		calculateDevices,
		sortObjectValuesAsc,
		getVersionOptions,
		getCountryOptions,
		sortVersions,
		calculateDaysPercentage
	} from '$lib/helpers/helperFunctions';
	import Table from '$lib/components/Table.svelte'
	import Chart from '$lib/components/Chart.svelte'

	const optionGameAll = {
		app_id: 'game_all',
		name: 'All',
		icon: ''
	};
	const optionVersionAll = {
		value: 'version_all',
		name: 'All'
	};
	const optionCountryAll = {
		value: 'country_all',
		name: 'All'
	};

	const CHART_VIEW = 'chart';
	const TABLE_VIEW = 'table';

	export let data;
	let { games, retention } = data;

	let selectedGame = optionGameAll;
	let selectedVersion = optionVersionAll;
	let selectedCountry = optionCountryAll;
	let dataView = CHART_VIEW;

	const allGameIds = games.map((game) => game.app_id);
	$: gameIdsToFilterBy =
		!selectedGame || selectedGame?.app_id === optionGameAll.app_id
			? allGameIds
			: [selectedGame?.app_id];

	const allVersionNumbers = getUniqueObjectValues(retention, 'app_ver');
	$: versionsToFilterBy =
		!selectedVersion || selectedVersion?.value === optionVersionAll.value
			? allVersionNumbers
			: [selectedVersion?.value];

	const allCountryNames = getUniqueObjectValues(retention, 'country');
	$: countriesToFilterBy =
		!selectedCountry || selectedCountry?.value === optionCountryAll.value
			? allCountryNames
			: [selectedCountry?.value];

	// Available GAME options - always show all
	const gameOptions = [optionGameAll, ...sortObjectValuesAsc(games, 'name')];

	// Available VERSION options based on selected GAME & COUNTRY
	$: filteredRetention_version = retention.filter((item) => {
		return gameIdsToFilterBy.includes(item.app_id) && countriesToFilterBy.includes(item.country);
	});
	$: versionDevices = calculateDevices(filteredRetention_version, 'app_ver');
	$: versionOptions = [optionVersionAll, ...getVersionOptions(filteredRetention_version)];

	// Available COUNTRY options based on selected GAME & VERSION
	$: filteredRetention_country = retention.filter((item) => {
		return gameIdsToFilterBy.includes(item.app_id) && versionsToFilterBy.includes(item.app_ver);
	});
	$: countryDevices = calculateDevices(filteredRetention_country, 'country');
	$: countryOptions = [optionCountryAll, ...getCountryOptions(filteredRetention_country, countryDevices)];

	// Clear VERSION & COUNTRY selections when changing GAME
	// In case current option is no longer available
	$: if (selectedGame) {
		clearSelections();
	}

	const clearSelections = async () => {
		if (selectedCountry?.value !== optionCountryAll.value) {
			const selectionExists = countryOptions.find((country) => country.value === selectedCountry?.value);
			if (!selectionExists) {
				await tick();
				selectedCountry = optionCountryAll;
			}
		}

		if (selectedVersion?.value !== optionVersionAll.value) {
			const selectionExists = versionOptions.find((version) => version.value === selectedVersion?.value);
			if (!selectionExists) {
				await tick();
				selectedVersion = optionVersionAll;
			}
		}
	};

	const getOptionMarkup = (name, devices) => {
		if (name === optionCountryAll.name || name === optionVersionAll.name) {
			return name;
		} else {
			return `${name} (${devices[name]})`;
		}
	};

	const getIconOptionMarkup = (name, icon) => {
		if (!icon) {
			return name;
		} else {
			return `<img 
				src="${icon}"
				alt="${name}"
				style="height: 20px; width: 20px; object-fit: contain"
			/> ${name}`;
		}
	};

	const getDataToDisplay = (data) => {
		const sorted = sortVersions(data, "app_ver");
		const calculated = sorted.map((item) => {
			return {
				...item,
				days: calculateDaysPercentage(item.days)
			}
		});

		return calculated;
	}

	$: filteredRetentionData = retention.filter(item => {
		return gameIdsToFilterBy.includes(item.app_id)
		&& versionsToFilterBy.includes(item.app_ver)
		&& countriesToFilterBy.includes(item.country);
	})

	$: dataToDisplay = getDataToDisplay(filteredRetentionData)

	// beforeUpdate(() => 
	// 	console.log('updated')
	// )

</script>

<div>
	<h2>FILTER BAR - game, version, country</h2>
	<Svelecte
		options={gameOptions}
		bind:value={selectedGame}
		placeholder="Select Game"
		labelField="name"
		valueField="app_id"
		valueAsObject
		renderer={(option) => {
			return getIconOptionMarkup(option.name, option.icon);
		}}
	/>
	<p>Selected game id: {selectedGame?.name}</p>

	<Svelecte
		options={versionOptions}
		bind:value={selectedVersion}
		placeholder="Select Version"
		labelField="name"
		valueAsObject
		renderer={(option) => {
			return getOptionMarkup(option.name, versionDevices);
		}}
	/>
	<p>Selected version: {selectedVersion?.name}</p>

	<Svelecte
		options={countryOptions}
		bind:value={selectedCountry}
		placeholder="Select Country"
		labelField="name"
		valueAsObject
		renderer={(option) => {
			return getOptionMarkup(option.name, countryDevices);
		}}
	/>
	<p>Selected country: {selectedCountry?.name}</p>
</div>

<div>
	<h2>VIEW BAR - table or chart option</h2>
	<button on:click={() => dataView = TABLE_VIEW}>Table</button>
	<button on:click={() => dataView = CHART_VIEW}>Chart</button>
	<p>Showing: {dataView}</p>
</div>

<div>
	<h2>CONTENT</h2>
	{#if dataView === TABLE_VIEW}
		<Table 
			retention={dataToDisplay}
			multipleGamesSelected={selectedGame.app_id === optionGameAll.app_id}
		/>
	{:else}
		<Chart 
			retention={dataToDisplay}
			multipleGamesSelected={selectedGame.app_id === optionGameAll.app_id}
		/>
	{/if}
</div>
