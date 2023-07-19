import { env } from '$env/dynamic/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { COOKIES, makeSpotifyRequest } from '$lib/auth';
import type { PageServerLoad } from './$types';
import type { UserResponse } from '@spotify/web-api-ts-sdk';

export const load: PageServerLoad = async ({ cookies }) => {
	const spotifyToken = cookies.get(COOKIES.access_token);
	if (spotifyToken) {
		const spotifyUserProfile = (await makeSpotifyRequest(spotifyToken, '/me')) as UserResponse;
		if (spotifyUserProfile) {
			return {
				auth: true,
				access_token: spotifyToken,
				scopes: cookies.get(COOKIES.scope)!.split(' '),
				profile: spotifyUserProfile
			};
		} else {
			// refresh token
			const spotifyRefreshToken = cookies.get(COOKIES.refresh_token);
			if (spotifyRefreshToken) {
				const data = {
					grant_type: 'refresh_token',
					refresh_token: ''
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

				const tokenData = (await res.json()) as { access_token: string };
				cookies.set(COOKIES.access_token, tokenData.access_token, { path: '/' });

				const spotifyUserProfile = (await makeSpotifyRequest(
					tokenData.access_token,
					'/me'
				)) as UserResponse;
				if (spotifyUserProfile) {
					return {
						auth: true,
						access_token: tokenData.access_token,
						scopes: cookies.get(COOKIES.scope)!.split(' '),
						profile: spotifyUserProfile
					};
				}
			}
			return {
				auth: false
			};
		}
	}
};
