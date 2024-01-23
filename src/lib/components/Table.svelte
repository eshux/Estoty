<script>
	export let retention;
	export let multipleGamesSelected;

  $: tableData = retention
</script>

<div>
	{#if !tableData || !tableData.length}
		<p>No data</p>
	{:else}

  {#if multipleGamesSelected}
    <p>
      Multiple Games are selected - you might see some version and country duplicates, but each of them
      represents a different game
    </p>
  {/if}
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
		border: 1px solid lightgray;

		max-width: 800px;
		max-height: 500px;
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

		/* first col width + cell padding x2 */
		left: 116px;
	}

	.first-row {
		height: 30px;
		min-height: 30px;
		max-height: 30px;
		top: 0px;
		z-index: 1;
	}

	.sticky {
		position: -webkit-sticky;
		position: sticky;
		background-color: lightgray;
	}

	table {
		border-spacing: 0;
	}

	th,
	td {
		padding: 8px;
		border: none;
		border-bottom: 1px solid white;
	}
</style>
