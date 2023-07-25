<script lang="ts">
	import type { PlaylistWithTracks } from '$lib/types';

	export let pl: PlaylistWithTracks;
</script>

{#if pl.playlist.images.length > 0}<img src={pl.playlist.images[0].url} alt="playlist cover" />{/if}
<h2>
	{pl.playlist.name} - {pl.tracks.length} songs - by
	<a href={pl.playlist.owner.external_urls.spotify}>{pl.playlist.owner.display_name}</a>
</h2>

<style>
	img {
		aspect-ratio: 1;
		max-width: 20vmin;
		min-width: 20px;
	}
</style>
