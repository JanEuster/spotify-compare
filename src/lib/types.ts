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
		full: { artists: SimplifiedArtist[]; a: TrackMatch; b: TrackMatch }[]; // all artists for a song match to another song
		one: {
			[artistId: string]: { artist: SimplifiedArtist; a: TrackMatch; b: TrackMatch };
		}; // e.g. one of two artists for a song match to another song
	};
	album: {
		same: { [albumId: string]: { album: SimplifiedAlbum; total: number; tracks: TrackMatch } };
	};
	genre: {
		album: { [genre: string]: { album: SimplifiedAlbum; total: number } };
		artist: { [genre: string]: { artist: SimplifiedArtist; total: number } };
	};
	date_added: { [date: string]: { a: number; b: number } };
};

export enum MatchState {
	Left = 0,
	Right = 1,
	Both = 2
}
