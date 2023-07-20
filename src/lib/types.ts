import type { Playlist, PlaylistedTrack, SpotifyApi, UserResponse } from '@spotify/web-api-ts-sdk';

export type PlaylistAreaType = PlaylistWithTracks | Playlist[] | 'loading' | null;
export type SpotifyStore = { sdk: SpotifyApi; profile: UserResponse } | null;
export type PlaylistStore = { playlists: Playlist[]; fetched: Date };
export type PlaylistWithTracks = { playlist: Playlist; tracks: PlaylistedTrack[] };
