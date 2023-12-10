<script lang="ts">
	export let board: string[][];
	export let onClick: (rowIndex: number, columnIndex: number) => void;
</script>
  
<style>

	.container {
		width: 70vmin;
		height: 70vmin;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-content: center;
		justify-content: center;
		align-items: center;
	}

	.button-option {
		background: #ece7e7;
		height: 22vmin;
		width: 22vmin;
		border: none;
		border-radius: 8px;
		font-size: 6vmin;
		color: rgb(44, 43, 43);
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
		font-weight: bold;
		font-size: 100px;
		margin: 15px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	
</style>
  
<div class="container">
		{#each board as row, rowIndex}
			<div>
				{#each row as column, columnIndex}
					<div class="button-option"
						on:click={() => {
							onClick(rowIndex, columnIndex);
						}}>
						{column}
					</div>
				{/each}
			</div>
		{/each}
</div>