import React, { useState } from 'react';

import { useHistory, useNavigate, usePending, useSearch } from 'react-sprout';

import List, { Listitem, ListitemSpinner, ListitemText } from '../../components/list.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';
import Tabs, { Tab } from '../../components/tabs.jsx';
import useLocalStorageState from '../../hooks/use-local-storage-state.js';
import FavoriteIcon from '../../components/favorite-icon.jsx';
import DivisionIcon from '../../components/division-icon.jsx';

export default function Divisions() {
	let history = useHistory();
	let pending = usePending();
	let navigate = useNavigate();
	let { tab = 'all' } = useSearch();
	let [selected, setSelected] = useState();
	let [favoriteDivisions, setFavoriteDivisions] = useLocalStorageState('favoritesDivisions', []);

	function handleTabChange(event, tab) {
		navigate(`?tab=${tab}`, { replace: true });
	}

	let render;
	if (tab === 'all') {
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

		render = (
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
		);
	} else if (tab === 'favorites' && favoriteDivisions.length) {
		let favoriteDivisionsListItemsRender = favoriteDivisions.map(function (division) {
			let { id } = division;

			function handleIconClick(event) {
				event.stopPropagation();
			}

			function handleFavoriteChange(event, favorite) {
				let { id } = division;

				if (favorite) {
					setFavoriteDivisions([...favoriteDivisions, division]);
				} else {
					setFavoriteDivisions(favoriteDivisions.filter(division => division.id != id));
				}
			}

			function handleListitemClick() {
				setSelected(division);
				history.navigate(`/divisions/${division.id}`, { sticky: true });
			}

			let favorite = favoriteDivisions.some(division => division.id === id);

			let listitemSpinnerOrFavoriteRender;
			if (pending && selected === division) {
				listitemSpinnerOrFavoriteRender = <ListitemSpinner />;
			} else {
				listitemSpinnerOrFavoriteRender = (
					<FavoriteIcon defaultValue={favorite} onChange={handleFavoriteChange} onClick={handleIconClick} />
				);
			}

			return (
				<Listitem key={division.id} onClick={handleListitemClick}>
					<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-center">
						<DivisionIcon division={division} />
						<ListitemText>{division.name}</ListitemText>
						{listitemSpinnerOrFavoriteRender}
					</div>
				</Listitem>
			);
		});

		render = <List>{favoriteDivisionsListItemsRender}</List>;
	} else if (tab === 'favorites') {
		render = <div className="grid w-full h-full items-x-center items-y-center">No favorite divisions found</div>;
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<ApplicationBarTitle>Divisions</ApplicationBarTitle>
				<div className="-mx-4 -mb-4">
					<Tabs value={tab} onChange={handleTabChange}>
						<Tab label="all" />
						<Tab label="favorites" />
					</Tabs>
				</div>
			</ApplicationBar>

			{render}
		</div>
	);
}
