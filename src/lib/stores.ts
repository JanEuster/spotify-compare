import { writable, type Writable } from 'svelte/store';
import type { SpotifyStore } from './types';

export const spotifyStore: Writable<SpotifyStore> = writable();
