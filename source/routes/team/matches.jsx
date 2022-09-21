import { useState } from 'react';

import { useData, useHistory, usePending } from 'react-sprout';
import { useTeam } from '../team.jsx';
import { getMatches } from 'vttl-api';

import MatchList from '../../views/match-list.jsx';

export async function fetchTeamMatches(params) {
	let teamLetter = params.teamLetter === '_' ? '' : params.teamLetter;
	let matches = await getMatches({
		Club: params.clubId,
		Team: teamLetter,
		DivisionId: params.divisionId,
	});
	return matches;
}

export default function TeamMatches() {
	let team = useTeam();
	let matches = useData();
	let history = useHistory();
	let pending = usePending();
	let [selectedMatch, setSelectedMatch] = useState();

	function handleSelect(event, match) {
		setSelectedMatch(match);

		let matchUrl;
		if (match.id) {
			matchUrl = `/matches/${match.id}`;
		} else {
			matchUrl = `/matches/${match.division.id}/${encodeURIComponent(match.name)}`;
		}
		history.navigate(matchUrl, { sticky: true });
	}

	return (
		<MatchList
			club={team.club.id}
			team={team.letter}
			matches={matches}
			pending={pending}
			selected={selectedMatch}
			onSelect={handleSelect}
		/>
	);
}
