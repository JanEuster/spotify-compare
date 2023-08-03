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
	params: Record<string, any> | undefined
): Promise<Record<string, any> | null> => {
	const urlParams = params ? '?' + new URLSearchParams(params).toString() : '';
	console.info(urlParams);
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
export const scope = 'playlist-read-private playlist-read-collaborative';
