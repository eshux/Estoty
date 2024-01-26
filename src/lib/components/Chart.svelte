<script>
	import Chart from 'chart.js/auto';
	import { groupBy } from '$lib/helpers/helperFunctions';

	export let retention;
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
			maintainAspectRatio: false,
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
				},
				legend: {
					position: 'right',
					labels: {
						useBorderRadius: false,
						boxWidth: 10,
						boxHeight: 10,
						padding: 8
					},
					title: {
						display: true,
						text: "Versions",
						font: {
							size: 14
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

<div>
	{#if !data || !data.length}
		<p>No data</p>
	{:else}
		<canvas use:handleChart={chartConfig} class="chart"></canvas>
	{/if}
</div>

<style>
	.chart {
		max-height: 600px;
		min-height: 450px;
	}

	@media only screen and (max-width: 600px) {
		.chart {
			min-height: 300px;
		}
	}
</style>
