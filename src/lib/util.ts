import type { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';
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
	const p1TrackNames = p1Tracks.map((t) =>
		t.name.split(/[.\-_]/).length < 3 ? t.name.split(/[.\-_]/)[0].toLowerCase() : t.name.toLowerCase()
	);
	const p2TrackNames = p2Tracks.map((t) =>
		t.name.split(/[.\-_]/).length < 3 ? t.name.split(/[.\-_]/)[0].toLowerCase() : t.name.toLowerCase()
	);
	// split and only look at name before first special char
	// expect when there are more than 2 special chars, then it is assumed the song name is *contemporary* and therefore not split
	const p1TrackIds = p1Tracks.map((t) => t.id);
	const p2TrackIds = p2Tracks.map((t) => t.id);

	// song.identical
	const songIdenticalIds = p1TrackIds.filter((t) => p2TrackIds.includes(t));
	intersections.song.identical = p1.tracks.filter((t) => songIdenticalIds.includes(t.track.id));

	// song.similar
	const songSimilar1 = p1.tracks.filter((t) => p2TrackNames.includes(t.track.name.toLowerCase())) as PlaylistedTrack[];
	const songSimilar2 = p2.tracks.filter((t) => p1TrackNames.includes(t.track.name.toLowerCase())) as PlaylistedTrack[];
	// console.log(p1TrackNames);
	// console.log(p2TrackNames);
	intersections.song.similar = [...songSimilar1, ...songSimilar2].filter(
		(songSimilar) => !songIdenticalIds.includes(songSimilar.track.id)
	);

	// artist.one
	const p1TrackPrimaryArtists = p1.tracks.map((t) => (t.track as Track).artists[0]);
	const p2TrackPrimaryArtists = p2.tracks.map((t) => (t.track as Track).artists[0]);

	const primaryArtists: PlaylistIntersections['artist']['one'] = {};
	p1TrackPrimaryArtists.forEach((artist, i) => {
		if (Object.keys(primaryArtists).includes(artist.id)) {
			primaryArtists[artist.id].a.push(p1.tracks[i]);
		} else {
			primaryArtists[artist.id] = { artist: artist, a: [p1.tracks[i]], b: [] };
		}
	});
	p2TrackPrimaryArtists.forEach((artist, i) => {
		console.log(artist.name);
		if (Object.keys(primaryArtists).includes(artist.id)) {
			console.log(primaryArtists[artist.id].b);
			primaryArtists[artist.id].b.push(p2.tracks[i]);
		} else {
			primaryArtists[artist.id] = { artist: artist, a: [], b: [p2.tracks[i]] };
		}
	});
	intersections.artist.one = primaryArtists;

	return intersections;
};
