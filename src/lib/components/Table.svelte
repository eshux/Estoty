<script>
	export let retention;

	$: tableData = retention;
</script>

<div>
	{#if !tableData || !tableData.length}
		<p>No data</p>
	{:else}
		<div class="wrapper">
			<table>
				<thead>
					<tr class="sticky first-row">
						<th class="sticky first-col">Version</th>
						<th class="sticky second-col">Country</th>
						{#each tableData[0].days as day, index (`D${index}`)}
							<th>D{index}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each tableData as item, index (`row-${index}`)}
						<tr>
							<td class="sticky first-col">{item.app_ver}</td>
							<td class="sticky second-col">{item.country}</td>
							{#each item.days as day, i (`row-${index}-col-${i}`)}
								<td>{day}%</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		position: relative;
		overflow: auto;
		margin: 8px;
		border-radius: 4px;
		max-height: 600px;
	}

	.first-col {
		width: 100px;
		min-width: 100px;
		max-width: 100px;
		left: 0px;
	}

	.second-col {
		width: 150px;
		min-width: 150px;
		max-width: 150px;
		/* first-col width */
		left: 100px;
	}

	.first-row {
		height: 30px;
		min-height: 30px;
		max-height: 30px;
		top: 0px;
		z-index: 1;
		box-shadow: 0 0 15px 1px #d3ad89;
	}

	.sticky {
		position: -webkit-sticky;
		position: sticky;
		background-color: #ffe0c0;
	}

	.sticky th {
		background-color: #ffcf9f;
	}

	table {
		border-spacing: 0;
	}

	td {
		border-bottom: 1px solid #ffcf9f;
	}

	td,
	th {
		padding: 12px;
		font-size: 0.9rem;
	}

	/* scroll */
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 5px #f3e9e0;
		border-radius: 0;
	}

	::-webkit-scrollbar-thumb {
		background: #d8c8b9;
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #ccbdaf;
	}

	@media only screen and (max-width: 600px) {
		.first-col {
			width: 80px;
			min-width: 80px;
			max-width: 80px;
			left: 0px;
		}

		.second-col {
			width: 100px;
			min-width: 100px;
			max-width: 100px;
			/* first-col width */
			left: 80px;
		}
	}

	@media only screen and (max-width: 300px) {
		tr .sticky {
			position: static;
		}
	}
</style>
