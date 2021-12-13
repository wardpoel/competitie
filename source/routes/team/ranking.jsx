import React from 'react';

import { useState } from 'react';
import { useHistory, useData, useParams, usePending } from 'react-sprout';
import { getRanking } from 'vttl-api';

import List, { Listitem, ListitemSubtext, ListitemText, ListitemSpinner } from '../../components/list.jsx';
import Avatar from '../../components/avatar.jsx';

import { useTeam } from '../team.jsx';

import color from '../../vttl/color.js';
import letter from '../../vttl/teams/letter.js';

export async function fetchTeamRanking(params) {
	let data = await getRanking({ DivisionId: params.divisionId });
	let rankings = data.rankings;

	for (let ranking of rankings) {
		ranking.team.letter = letter(ranking.team.name);
	}

	return data.rankings;
}

export default function TeamRanking() {
	let team = useTeam();
	let params = useParams();
	let history = useHistory();
	let pending = usePending();
	let rankings = useData();
	let [selectedRanking, setSelectedRanking] = useState();

	let rankingListitemsRender = rankings.map(function (ranking) {
		let { position, points, matches } = ranking;

		let isteamListitem = team.club.id === ranking.team.club && team.letter === ranking.team.letter;

		function handleClick() {
			if (isteamListitem) {
				history.navigate('matches', { replace: true });
			} else {
				let teamLetter = letter(ranking.team.name);
				let teamUrl = `/clubs/${ranking.team.club}/teams/${params.divisionId}/${teamLetter}/matches`;
				history.navigate(teamUrl, { sticky: true, state: { tabs: false } });
				setSelectedRanking(ranking);
			}
		}

		let listitemDecorationRender;
		if (pending && ranking === selectedRanking) {
			listitemDecorationRender = <ListitemSpinner />;
		} else {
			listitemDecorationRender = <ListitemText>{points}</ListitemText>;
		}

		return (
			<Listitem key={position} onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-y-center">
					<Avatar color={isteamListitem}>{position}</Avatar>
					<div className="flex flex-col">
						<ListitemText>{ranking.team.name}</ListitemText>
						<ListitemSubtext>{matches.total} matches</ListitemSubtext>
					</div>
					{listitemDecorationRender}
				</div>
			</Listitem>
		);
	});

	return <List>{rankingListitemsRender}</List>;
}
