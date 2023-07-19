import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createState, scope } from '../../../lib/auth';
import { env } from '$env/dynamic/public';
import { PUBLIC_TARGET_URL } from '$env/static/public';

const redirectURI = PUBLIC_TARGET_URL + '/auth/redirect';

export const load: PageServerLoad = async ({ cookies }) => {
	const state = createState();
	cookies.set('spotify-state', state, { maxAge: 10 * 60 }); // auth flow may only take 10 minutes to complete (very generous)
	throw redirect(
		308,
		`https://accounts.spotify.com/authorize?response_type=code&client_id=${env.PUBLIC_SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectURI}&state=${state}`
	);
};
