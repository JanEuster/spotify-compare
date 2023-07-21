import type {
	Playlist,
	PlaylistedTrack,
	SimplifiedAlbum,
	SimplifiedArtist,
	SpotifyApi,
	UserResponse
} from '@spotify/web-api-ts-sdk';

export type PlaylistAreaType = PlaylistWithTracks | Playlist[] | 'loading' | null;
export type SpotifyStore = { sdk: SpotifyApi; profile: UserResponse } | null;
export type PlaylistStore = { playlists: Playlist[]; fetched: Date };
export type PlaylistWithTracks = { playlist: Playlist; tracks: PlaylistedTrack[] };
export type TrackMatch = PlaylistedTrack[];
export type PlaylistIntersections = {
	song: {
		identical: PlaylistedTrack[];
		similar: PlaylistedTrack[];
	};
	artist: {
		full: { artists: SimplifiedArtist[]; total: number; tracks: TrackMatch }[]; // all artists for a song match to another song
		one: { [key: string]: { artist: SimplifiedArtist; total: number; tracks: TrackMatch } }; // e.g. one of two artists for a song match to another song
	};
	album: {
		same: { [key: string]: { album: SimplifiedAlbum; total: number; tracks: TrackMatch } };
	};
	genre: {
		album: { [key: string]: { album: SimplifiedAlbum; total: number } };
		artist: { [key: string]: { artist: SimplifiedArtist; total: number } };
	};
	date_added: { [key: string]: { a: number; b: number } };
};
