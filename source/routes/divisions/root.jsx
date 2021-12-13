import React from 'react';

import { useHistory } from 'react-sprout';

import List, { Listitem, ListitemText } from '../../components/list.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

export default function Divisions() {
	let history = useHistory();

	function handleSuperClick() {
		history.navigate('/divisions/super/');
	}

	function handleNationalClick() {
		history.navigate('/divisions/national/');
	}

	function handleRegionalClick() {
		history.navigate('/divisions/regional/');
	}

	function handleProvincialClick() {
		history.navigate('/divisions/provincial/');
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<ApplicationBarTitle>Divisions</ApplicationBarTitle>
			</ApplicationBar>
			<List>
				<Listitem onClick={handleSuperClick}>
					<ListitemText>Super</ListitemText>
				</Listitem>
				<Listitem onClick={handleNationalClick}>
					<ListitemText>National</ListitemText>
				</Listitem>
				<Listitem onClick={handleRegionalClick}>
					<ListitemText>Regional</ListitemText>
				</Listitem>
				<Listitem onClick={handleProvincialClick}>
					<ListitemText>Provincial</ListitemText>
				</Listitem>
			</List>
		</div>
	);
}
