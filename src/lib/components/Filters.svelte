<script>
	import Svelecte from 'svelecte';
	import { tick } from 'svelte';
  import { OPTION_ALL } from '$lib/helpers/data';
	import {
		calculateDevices,
		sortObjectValuesAsc,
		getVersionOptions,
		getCountryOptions
	} from '$lib/helpers/helperFunctions';

	export let selectedGame;
	export let selectedVersion;
	export let selectedCountry;
	export let filterBy;
	export let games;
	export let retention;

	// Available GAME options - always show all
	const gameOptions = [OPTION_ALL.game, ...sortObjectValuesAsc(games, 'name')];

	// Available VERSION options based on selected GAME & COUNTRY
	$: filteredRetention_version = retention.filter((item) => {
		return filterBy.gameId.includes(item.app_id) && filterBy.country.includes(item.country);
	});
	$: versionDevices = calculateDevices(filteredRetention_version, 'app_ver');
	$: versionOptions = [OPTION_ALL.version, ...getVersionOptions(filteredRetention_version)];

	// Available COUNTRY options based on selected GAME & VERSION
	$: filteredRetention_country = retention.filter((item) => {
		return filterBy.gameId.includes(item.app_id) && filterBy.version.includes(item.app_ver);
	});
	$: countryDevices = calculateDevices(filteredRetention_country, 'country');
	$: countryOptions = [OPTION_ALL.country, ...getCountryOptions(filteredRetention_country, countryDevices)];

	// Clear VERSION & COUNTRY selections when changing GAME
	$: if (selectedGame) {
		clearSelections();
	}

	const clearSelections = async () => {
		if (selectedCountry?.value !== OPTION_ALL.country.value) {
			const selectionExists = countryOptions.find((country) => country.value === selectedCountry?.value);
			if (!selectionExists) {
				await tick();
				selectedCountry = OPTION_ALL.country;
			}
		}

		if (selectedVersion?.value !== OPTION_ALL.version.value) {
			const selectionExists = versionOptions.find((version) => version.value === selectedVersion?.value);
			if (!selectionExists) {
				await tick();
				selectedVersion = OPTION_ALL.version;
			}
		}
	};

	const getDeviceOptionMarkup = (name, devices) => {
		if (name === OPTION_ALL.country.name || name === OPTION_ALL.version.name) {
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
</script>

<div class="wrapper">
	<div class="select-wrapper">
		<label for="game">Game</label>
			<Svelecte
			inputId="game"
			options={gameOptions}
			bind:value={selectedGame}
			placeholder="Select game"
			labelField="name"
			valueField="app_id"
			valueAsObject
			renderer={(option) => {
				return getIconOptionMarkup(option.name, option.icon);
			}}
		/>
	</div>

	<div class="select-wrapper">
		<label for="version">Version</label>
		<Svelecte
			inputId="version"
			options={versionOptions}
			bind:value={selectedVersion}
			placeholder="Select version"
			labelField="name"
			valueAsObject
			renderer={(option) => {
				return getDeviceOptionMarkup(option.name, versionDevices);
			}}
		/>
	</div>

	<div class="select-wrapper">
		<label for="country">Country</label>
		<Svelecte
			inputId="country"
			options={countryOptions}
			bind:value={selectedCountry}
			placeholder="Select country"
			labelField="name"
			valueAsObject
			renderer={(option) => {
				return getDeviceOptionMarkup(option.name, countryDevices);
			}}
		/>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.select-wrapper {
		flex: 1 1 0;
		margin: 0 8px;
		max-width: 100%;
	}

	label {
		display: inline-block;
		margin-bottom: 8px;
	}

	@media only screen and (max-width: 600px) {
		.wrapper {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
		}
	}
</style>