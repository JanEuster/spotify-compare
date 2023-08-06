import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_TARGET_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { type SpotifyTokenData } from '$lib/auth';
import type { AccessToken } from '@spotify/web-api-ts-sdk';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const state = cookies.get('spotify-state');
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	if (state == url.searchParams.get('state') && code && !error) {
		const data = {
			redirect_uri: PUBLIC_TARGET_URL + '/auth/redirect',
			code: code,
			grant_type: 'authorization_code'
		};

		const res = await fetch(`https://accounts.spotify.com/api/token`, {
			method: 'POST',
			body: new URLSearchParams(data),
			headers: {
				// Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET).toString(
					'base64'
				)}`
			}
		});
		console.log(res.status, res.statusText);
		const tokenData = (await res.json()) as AccessToken;
		cookies.set('spotifyAccessToken', JSON.stringify(tokenData), { path: '/', maxAge: tokenData.expires_in });
		throw redirect(307, '/?auth_status=success');
	} else {
		// something went wrong
		throw redirect(307, '/?auth_status=' + error ?? 'state_mismatch');
	}
};
