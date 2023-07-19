import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { COOKIES, type SpotifyTokenData } from '$lib/auth';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const state = cookies.get('spotify-state');
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	if (state == url.searchParams.get('state') && code && !error) {
		const data = {
			redirect_uri: 'http://localhost:5173/auth/redirect',
			code: code,
			grant_type: 'authorization_code'
		};

		const res = await fetch(`https://accounts.spotify.com/api/token`, {
			method: 'POST',
			body: new URLSearchParams(data),
			headers: {
				// Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(
					PUBLIC_SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET
				).toString('base64')}`
			}
		});
		console.log(res.status, res.statusText);
		const tokenData = (await res.json()) as SpotifyTokenData;
		cookies.set(COOKIES.access_token, tokenData.access_token, { path: '/' });
		cookies.set(COOKIES.refresh_token, tokenData.refresh_token, { path: '/' });
		cookies.set(COOKIES.scope, tokenData.scope, { path: '/' });
		throw redirect(307, '/?auth_status=success');
	} else {
		// something went wrong
		throw redirect(307, '/?auth_status=' + error ?? 'state_mismatch');
	}
};
