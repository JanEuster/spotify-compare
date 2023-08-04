import { env } from '$env/dynamic/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { getSpotifyProfile, scope, type SpotifyError } from '$lib/auth';
import type { PageServerLoad } from './$types';
import type { AccessToken, UserResponse } from '@spotify/web-api-ts-sdk';

export const load: PageServerLoad = async ({ cookies }) => {
	const tokenCookie = cookies.get('spotifyAccessToken');
	if (tokenCookie) {
		const accessToken = JSON.parse(tokenCookie) as AccessToken;
		const spotifyUserProfile = await getSpotifyProfile(accessToken.access_token);

		console.log('spotifyUserProfile', spotifyUserProfile);
		if (!(spotifyUserProfile as SpotifyError).error) {
			return {
				auth: true,
				accessToken: accessToken,
				scopes: scope.split(' '),
				profile: spotifyUserProfile as UserResponse
			};
		} else {
			// refresh token
			const spotifyRefreshToken = accessToken.refresh_token;
			if (spotifyRefreshToken) {
				const data = {
					grant_type: 'refresh_token',
					refresh_token: accessToken.refresh_token
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

				console.log('before refresh', accessToken.access_token);
				accessToken.access_token = (await res.json()).access_token;
				console.log('after refresh', accessToken.access_token);
				cookies.set('spotifyAccessToken', JSON.stringify(accessToken), { path: '/' });

				const spotifyUserProfile = await getSpotifyProfile(accessToken.access_token);
				console.log('refresh', spotifyUserProfile, accessToken);
				console.log('refreshed token', (await res.json()).access_token);
				if (spotifyUserProfile && !(spotifyUserProfile as SpotifyError).error) {
					return {
						auth: true,
						accessToken: accessToken,
						scopes: scope.split(' '),
						profile: spotifyUserProfile as UserResponse
					};
				}
			}
		}
	}
	return {
		auth: false
	};
};
