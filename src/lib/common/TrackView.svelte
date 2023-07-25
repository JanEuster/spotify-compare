<script lang="ts">
	import type { PlaylistedTrack } from '@spotify/web-api-ts-sdk';

	export let track: PlaylistedTrack;
</script>

<div class="track">
	{#if track.track.album}
		<!-- this info can only be displayed when the item is a track, not an episode => track.track.track = true && track.track.episode = false -->
		{#if track.track.album.images.length > 0}
			<a href={track.track.external_urls.spotify} target="_blank">
				<div class="track-img-container">
					<img src={track.track.album.images[track.track.album.images.length - 1].url} />
				</div>
			</a>
		{/if}
		<div class="text">
			{#if track.track.album.album_type != 'single'}
				<h6>
					{track.track.name.toLowerCase() != track.track.album.name.toLowerCase() ? track.track.album.name : ''}
				</h6>
			{/if}
			<h4>
				{track.track.name}
			</h4>
			<ul>
				{#each track.track.artists as artist}
					<li><h5>{artist.name}</h5></li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	.track {
		border: 1px dotted var(--c-green-100);
		border-radius: 6px;
		margin-bottom: 2px;
		padding: 6px;

		display: flex;
		gap: 10px;
		& > .text {
			display: flex;
			flex-direction: column;
			justify-content: start;
			align-items: start;

			h6 {
				display: inline-block;
				color: var(--c-grey);
				// text-decoration: underline ;
				text-underline-offset: 5px;
				font-style: italic;
				letter-spacing: -0.5px;
				margin-bottom: 11px;
				position: relative;
				&::after {
					content: '';
					position: absolute;
					top: calc(100% + 3px);
					left: 0;
					width: calc(100% + 3px);
					height: 1px;
					background-color: var(--c-grey);
				}
			}
			h4 {
				margin-top: -2px;
				font-size: 19px;
				word-spacing: -4px;
			}

			ul {
				list-style: none;
				display: flex;
				flex-wrap: wrap;
				li {
					display: inline-block;
					margin-right: 16px;
					h5 {
						font-size: 12px;
						letter-spacing: -0.5px;
						color: var(--c-offwhite);
						text-decoration: 2px var(--c-offwhite) underline;
						text-underline-offset: 2px;
						text-decoration-style: dotted;
					}
				}
			}
		}
	}
</style>
