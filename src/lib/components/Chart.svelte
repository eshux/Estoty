<script>
	import Chart from 'chart.js/auto';
	import { groupBy } from '$lib/helpers/helperFunctions';

	export let retention;
	export let multipleGamesSelected;
	const indexes = [0, 5, 10, 20, 25, 30, 60, 90];

	const getChartData = (rawData) => {
		const groupedByVersion = groupBy(rawData, 'app_ver');
		const data = [];

		for (let key in groupedByVersion) {
			const results = [];

			groupedByVersion[key].forEach((item) => {
				item.days.forEach((day, i) => {
					if (indexes.includes(i)) {
						results.push({
							x: 'D' + i,
							y: day,
							country: item.country
						});
					}
				});
			});

			data.push({ label: key, data: results });
		}
		return data;
	};

	$: data = getChartData(retention);

	$: chartConfig = {
		type: 'bar',
		data: {
			datasets: data
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context) {
							let label = context.dataset.label || '';
							const country = context.raw?.country || '';

							if (country) {
								label += ` ${country}`;
							}
							if (context.parsed.y !== null) {
								label += `: ${context.parsed.y}%`;
							}
							return label;
						}
					}
				}
			}
		}
	};

	const handleChart = (element, config) => {
		let chart = new Chart(element, config);

		return {
			update(config) {
				chart.destroy();
				chart = new Chart(element, config);
			},
			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<div class="">
	{#if multipleGamesSelected}
		<p>
			Multiple Games are selected - you might see some version and country duplicates, but each of them
			represents a different game
		</p>
	{/if}

	<canvas use:handleChart={chartConfig} class="chart"></canvas>
</div>

<style>
	.chart {
		max-width: 800px;
		max-height: 500px;
	}
</style>
