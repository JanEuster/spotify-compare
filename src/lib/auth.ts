import type { AccessToken, Page, Playlist, PlaylistedTrack, UserResponse } from '@spotify/web-api-ts-sdk';

export const createState = (): string => {
	// unguessable random string to protect against CSRF attacks
	let state = '';
	for (let i = 0; i < 32; i++) {
		state += '0123456789abcdefghijklmnopqrstuvwxyz'.split('')[parseInt(String(Math.random() * 36))];
	}
	return state;
};

export type SpotifyTokenData = {
	access_token: string;
	token_type: string;
	expires_in: string;
	refresh_token: string;
	scope: string;
};
export type SpotifyError = {
	error: {
		status: number;
		message: string;
	};
};

export const SPOTIFY_BASE = 'https://api.spotify.com/v1';
export const makeSpotifyRequest = async (
	token: string,
	endpoint: string,
	params: Record<string, any> | null
): Promise<Record<string, any> | null> => {
	const urlParams = params ? '?' + new URLSearchParams(params).toString() : '';
	console.log(SPOTIFY_BASE + endpoint + urlParams);
	const res = await fetch(SPOTIFY_BASE + endpoint + urlParams, {
		cache: 'reload',
		headers: {
			// Pragma: 'no-cache',
			// 'Cache-Control': 'no-store',
			Authorization: `Bearer ${token}`
		}
	});
	try {
		return res.json();
	} catch (error) {
		return null;
	}
};

export const getSpotifyProfile = async (access_token: string) => {
	return (await makeSpotifyRequest(access_token, '/me', null)) as UserResponse | SpotifyError;
};
export class SpotifySdk {
	accessToken: AccessToken;
	profile: UserResponse;
	currentUser: SpotifyCurrentUserEndpoint;
	playlists: SpotifyPlaylistsEndpoint;
	constructor(accessToken: AccessToken, profile: UserResponse) {
		this.accessToken = accessToken;
		this.profile = profile;
		this.currentUser = new SpotifyCurrentUserEndpoint(accessToken, profile.id);
		this.playlists = new SpotifyPlaylistsEndpoint(accessToken);
	}
	static async initialize(accessToken: AccessToken) {
		const profile = await getSpotifyProfile(accessToken.access_token);
		if (!(profile as SpotifyError).error) {
			return new SpotifySdk(accessToken, profile as UserResponse);
		}
		throw new Error('Authentication failed');
	}
}
export class SpotifyCurrentUserEndpoint {
	private accessToken: AccessToken;
	id: string;
	constructor(accessToken: AccessToken, id: string) {
		this.accessToken = accessToken;
		this.id = id;
	}
	async profile() {
		return await getSpotifyProfile(this.accessToken.access_token);
	}
	async getPlaylists(): Promise<Playlist[]> {
		const userPlaylists: Playlist[] = [];
		let offset = 0;
		while (true) {
			const newPlaylists = (await makeSpotifyRequest(this.accessToken.access_token, `/users/${this.id}/playlists`, {
				offset: offset
			})) as Page<Playlist>;
			userPlaylists.push(...newPlaylists.items);
			if (newPlaylists.limit + newPlaylists.offset > newPlaylists.total) {
				break;
			}
			offset += newPlaylists.limit;
		}
		return userPlaylists;
	}
}

export class SpotifyPlaylistsEndpoint {
	private accessToken: AccessToken;
	constructor(accessToken: AccessToken) {
		this.accessToken = accessToken;
	}
	async getPlaylistItems(id: string): Promise<PlaylistedTrack[]> {
		const tracks: PlaylistedTrack[] = [];
		let offset = 0;
		while (true) {
			const newTracks = (await makeSpotifyRequest(this.accessToken.access_token, `/playlists/${id}/tracks`, {
				offset: offset
			})) as Page<PlaylistedTrack>;
			if (newTracks) {
				offset += newTracks.limit;
				tracks.push(...newTracks.items);
			}
			if (!newTracks || newTracks.offset + newTracks.limit > newTracks.total) {
				break;
			}
		}
		return tracks;
	}
}

export const scope = 'playlist-read-private playlist-read-collaborative';
