import { useState } from 'react';
import { useData, useParams, useHistory, usePending } from 'react-sprout';
import { getTeams } from 'vttl-api';
import DivisionIcon from '../../components/division-icon.jsx';

import List, { Listitem, ListitemText, ListitemSubtext, ListitemSpinner } from '../../components/list.jsx';

import sortTeams from '../../vttl/teams/sort.js';

import { useClub } from '../club.jsx';

export async function fetchClubTeams(params) {
	let teams = await getTeams({ Club: params.clubId });
	let sortedTeams = sortTeams(teams);

	return sortedTeams;
}

export default function ClubTeams() {
	let club = useClub();
	let teams = useData();
	let params = useParams();
	let history = useHistory();
	let pending = usePending();
	let [selectedTeam, setSelectedTeam] = useState();

	if (teams.length === 0) {
		return <div className="grid items-x-center items-y-center">No teams found</div>;
	}

	let teamListitems = teams.map(function (team) {
		function handleClick() {
			setSelectedTeam(team);

			let teamLetter = team.letter === '' ? '_' : team.letter;
			let teamUrl = `/clubs/${params.clubId}/teams/${team.division.id}/${teamLetter}`;
			history.navigate(teamUrl, { sticky: true, state: { division: false } });
		}

		let listitemSpinnerRender;
		if (pending && team === selectedTeam) {
			listitemSpinnerRender = <ListitemSpinner />;
		}

		return (
			<Listitem key={team.id} onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-y-center">
					<DivisionIcon division={team.division} />
					<div className="flex flex-col">
						<ListitemText>{`${club.name} ${team.letter}`}</ListitemText>
						<ListitemSubtext>{team.division.name}</ListitemSubtext>
					</div>
					{listitemSpinnerRender}
				</div>
			</Listitem>
		);
	});

	return (
		<div className="overflow-y-auto pb-2-safe">
			<List>{teamListitems}</List>
		</div>
	);
}
