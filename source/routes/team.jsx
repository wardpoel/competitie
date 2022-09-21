import React from 'react';

import { useRef, createContext, useContext } from 'react';
import { useSplat, useData, useHistory } from 'react-sprout';
import { getClubs, getTeams } from 'vttl-api';

import Tabs, { Tab } from '../components/tabs';
import Suspense from '../views/suspense';
import BackButton from '../components/back-button';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';

import { EmojiEventsIcon, FitnessCenterIcon } from 'material-icons';

export let TeamContext = createContext();

export function useTeam() {
	return useContext(TeamContext);
}

export async function fetchTeam(params) {
	let teamLetter = params.teamLetter === '_' ? '' : params.teamLetter;
	let fetchClubs = getClubs({ Club: params.clubId });
	let fetchTeams = getTeams({ Club: params.clubId });
	let [clubs, teams] = await Promise.all([fetchClubs, fetchTeams]);
	let [club] = clubs;

	let team = teams.find(team => team.division.id === params.divisionId && team.letter === teamLetter);

	return { ...team, club };
}

export default function Teams(props) {
	let team = useData();
	let history = useHistory();
	let mainRef = useRef();
	let [tab = 'matches'] = useSplat();

	function handleTabChange(event, tab) {
		mainRef.current.focus();
		history.navigate(tab, { replace: true });
	}

	let titleRender = team.letter === '' ? team.club.name : `${team.club.name} ${team.letter}`;
	let subtitleRender;
	if (history.state?.division) {
		subtitleRender = <div className="col-[2] truncate">{team.division.name}</div>;
	} else {
		function handleClick() {
			history.navigate(`/divisions/${team.division.id}/matches`, { state: { tabs: false } });
		}

		subtitleRender = (
			<div className="col-[2] truncate cursor-pointer" onClick={handleClick}>
				{team.division.name}
			</div>
		);
	}

	let tabsRender;
	if (history.state?.division == false) {
		tabsRender = (
			<div className="-mx-4 -mb-4">
				<Tabs value={tab} onChange={handleTabChange}>
					<Tab icon={FitnessCenterIcon} label="matches" />
					<Tab icon={EmojiEventsIcon} label="ranking" />
				</Tabs>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex flex-col items-stretch gap-4">
					<div className="grid grid-cols-[auto,minmax(0,1fr)] gap-x-4">
						<BackButton />
						<ApplicationBarTitle>{titleRender}</ApplicationBarTitle>
						{subtitleRender}
					</div>
					{tabsRender}
				</div>
			</ApplicationBar>
			<div
				ref={mainRef}
				className="grid grid-cols-1 grid-rows-1 overflow-y-auto focus:outline-none pb-0-safe"
				tabIndex={-1}
			>
				<Suspense>
					<TeamContext.Provider value={team}>{props.children}</TeamContext.Provider>
				</Suspense>
			</div>
		</div>
	);
}
