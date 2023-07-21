import type { PlaylistedTrack } from '@spotify/web-api-ts-sdk';
import type { PlaylistIntersections, PlaylistWithTracks } from './types';

export const generateIntersections = (p1: PlaylistWithTracks, p2: PlaylistWithTracks): PlaylistIntersections => {
	const intersections: PlaylistIntersections = {
		song: {
			identical: [],
			similar: []
		},
		artist: {
			full: [],
			one: {}
		},
		album: {
			same: {}
		},
		genre: {
			album: {},
			artist: {}
		},
		date_added: {}
	};

	const p1Tracks = p1.tracks.map((t) => t.track);
	const p2Tracks = p2.tracks.map((t) => t.track);
	const p1TrackNames = p1Tracks.map((t) => (t.name.split(/[.\-_]/).length < 3 ? t.name.split(/[.\-_]/)[0] : t.name));
	const p2TrackNames = p2Tracks.map((t) => (t.name.split(/[.\-_]/).length < 3 ? t.name.split(/[.\-_]/)[0] : t.name));
	// split and only look at name before first special char
	// expect when there are more than 2 special chars, then it is assumed the song name is *contemporary* and therefore not split
	const p1TrackIds = p1Tracks.map((t) => t.id);
	const p2TrackIds = p2Tracks.map((t) => t.id);

	// song.identical
	const songIdenticalIds = p1TrackIds.filter((t) => p2TrackIds.includes(t));
	intersections.song.identical = p1.tracks.filter((t) => songIdenticalIds.includes(t.track.id));

	// song.similar
	const songSimilar1 = p1.tracks.filter((t) => p2TrackNames.includes(t.track.name)) as PlaylistedTrack[];
	const songSimilar2 = p2.tracks.filter((t) => p1TrackNames.includes(t.track.name)) as PlaylistedTrack[];
	intersections.song.similar = [...songSimilar1, ...songSimilar2];

	return intersections;
};
