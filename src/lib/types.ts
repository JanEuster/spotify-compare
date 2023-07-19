import type { Playlist, UserResponse } from '@spotify/web-api-ts-sdk';

export type PlaylistAreaType = Playlist | Playlist[] | 'loading' | null;
export type SpotifyStore = { sdk: SpotifyApi; profile: UserResponse } | null;
export type PlaylistStore = { playlists: Playlist[]; fetched: Date };
