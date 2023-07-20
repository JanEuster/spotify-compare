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
	endpoint: string
): Promise<Record<string, any> | null> => {
	const res = await fetch(SPOTIFY_BASE + endpoint, {
		cache: 'reload',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	try {
		return res.json();
	} catch (error) {
		return null;
	}
};
export const scope = 'playlist-read-private playlist-read-collaborative';
