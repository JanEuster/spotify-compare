import { writable, type Writable } from 'svelte/store';
import type { PlaylistStore, SpotifyStore } from './types';
import type { Playlist } from '@spotify/web-api-ts-sdk';

export const spotifyStore: Writable<SpotifyStore> = writable(null);
export const spotifyPlaylists: Writable<PlaylistStore | null> = writable(null);
