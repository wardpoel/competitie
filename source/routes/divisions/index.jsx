import React from 'react';

import { useNavigate, useSearch } from 'react-sprout';

import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';
import Tabs, { Tab } from '../../components/tabs.jsx';

import { PublicIcon, StarIcon } from 'material-icons';
import DivisionsRoot from '../../views/divisions-root.jsx';
import DivisionsFavorites from '../../views/divisions-favorites.jsx';

export default function Divisions() {
	let navigate = useNavigate();

	let { tab = 'all' } = useSearch();

	function handleTabChange(event, tab) {
		navigate(`?tab=${tab}`, { replace: true });
	}

	let render;
	if (tab === 'all') {
		render = <DivisionsRoot />;
	} else if (tab === 'favorites') {
		render = <DivisionsFavorites />;
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<ApplicationBarTitle>Divisions</ApplicationBarTitle>
				<div className="-mx-4 -mb-4">
					<Tabs value={tab} onChange={handleTabChange}>
						<Tab icon={PublicIcon} label="all" />
						<Tab icon={StarIcon} label="favorites" />
					</Tabs>
				</div>
			</ApplicationBar>

			{render}
		</div>
	);
}
