import { useState, useLayoutEffect } from 'react';
import { useHistory, useData, useParams, usePending } from 'react-sprout';
import { getRanking } from 'vttl-api';

import List, { Listitem, ListitemSubtext, ListitemText, ListitemSpinner } from '../../components/list.jsx';
import Avatar from '../../components/avatar.jsx';

import { useSetDivisionName } from '../division.jsx';

import letter from '../../vttl/teams/letter.js';

export async function fetchDivisionRanking(params) {
	return await getRanking({ DivisionId: params.divisionId, ShowDivisionName: 'yes' });
}

export default function DivisionRanking() {
	let data = useData();
	let params = useParams();
	let pending = usePending();
	let history = useHistory();
	let setDivisionName = useSetDivisionName();
	let [selectedRanking, setSelectedRanking] = useState();
	let { division, rankings } = data;

	useLayoutEffect(() => {
		setDivisionName(division.name);
	}, [setDivisionName, division]);

	let render;
	if (rankings?.length) {
		let rankingListitemsRender = rankings?.map(function (ranking) {
			let { position, points, matches, team } = ranking;

			function handleClick() {
				let teamLetter = letter(team.name);
				let teamUrl = `/clubs/${team.club}/teams/${params.divisionId}/${teamLetter}/matches`;
				history.navigate(teamUrl, { sticky: true, state: { division: true } });
				setSelectedRanking(ranking);
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
						<Avatar>{position}</Avatar>
						<div className="flex flex-col">
							<ListitemText>{team.name}</ListitemText>
							<ListitemSubtext>{matches.total} matches</ListitemSubtext>
						</div>
						{listitemDecorationRender}
					</div>
				</Listitem>
			);
		});

		render = <List>{rankingListitemsRender}</List>;
	} else {
		render = <div className="grid items-x-center items-y-center">No ranking found</div>;
	}

	return <div className="overflow-y-auto pb-0-safe">{render}</div>;
}
