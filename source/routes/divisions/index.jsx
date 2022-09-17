import React from 'react';
import { useMemo, useState } from 'react';
import { useData, useSplat, useHistory, usePending } from 'react-sprout';

import List, { Listitem, ListitemSpinner, ListitemText } from '../../components/list.jsx';
import Suspense from '../../views/suspense.jsx';
import BackButton from '../../components/back-button.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

import sort from '../../vttl/divisions/sort.js';
import groupBy from '../../utilities/array/group-by.js';
import toSentenceCase from '../../utilities/string/to-sentence-case.js';
import DivisionIcon from '../../components/division-icon.jsx';
import FavoriteIcon from '../../components/favorite-icon.jsx';
import useLocalStorageState from '../../hooks/use-local-storage-state.js';

export default function Index() {
	let splat = useSplat();
	let history = useHistory();
	let pending = usePending();
	let [favoriteDivisions, setFavoriteDivisions] = useLocalStorageState('favoritesDivisions', []);
	let [selectedDivision, setSelectedDivision] = useState();
	let divisionIndexName = toSentenceCase(splat[splat.length - 1]);

	function handleFavoriteChange(event, division, favorite) {
		let { id } = division;

		if (favorite) {
			setFavoriteDivisions([...favoriteDivisions, division]);
		} else {
			setFavoriteDivisions(favoriteDivisions.filter(division => division.id != id));
		}
	}

	function handleDivisionSelect(event, division) {
		setSelectedDivision(division);
		history.navigate(`/divisions/${division.id}`, { sticky: true });
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex gap-4">
					<BackButton />
					<ApplicationBarTitle>{divisionIndexName}</ApplicationBarTitle>
				</div>
			</ApplicationBar>
			<div className="overflow-y-auto focus:outline-none">
				<Suspense>
					<DivisionsList
						pending={pending}
						selected={selectedDivision}
						favorites={favoriteDivisions}
						onFavoriteChange={handleFavoriteChange}
						onSelect={handleDivisionSelect}
					/>
				</Suspense>
			</div>
		</div>
	);
}

function DivisionsList(props) {
	let { pending, selected, favorites, onFavoriteChange, onSelect } = props;

	let splat = useSplat();
	let divisions = useData();
	let divisionsPath = splat.join('/');
	let divisionsByPath = useMemo(() => {
		let result = groupBy(divisions, 'path');
		for (let path in result) {
			result[path] = sort(result[path]);
		}
		return result;
	}, [divisions]);

	let listitemsRender = divisionsByPath[divisionsPath]?.map(function (division) {
		let { id } = division;
		function handleClick(event) {
			onSelect?.(event, division);
		}

		let listitemSpinnerOrFavoriteRender;
		if (pending && selected === division) {
			listitemSpinnerOrFavoriteRender = <ListitemSpinner />;
		} else {
			let favorite = favorites.find(division => division.id === id);
			function handleFavoriteChange(event, favorite) {
				onFavoriteChange?.(event, division, favorite);
			}
			function handleIconClick(event) {
				event.stopPropagation();
			}

			listitemSpinnerOrFavoriteRender = (
				<FavoriteIcon defaultValue={favorite} onChange={handleFavoriteChange} onClick={handleIconClick} />
			);
		}

		return (
			<Listitem key={division.id} onClick={handleClick}>
				<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-center">
					<DivisionIcon division={division} />
					<ListitemText>{division.shortname}</ListitemText>
					{listitemSpinnerOrFavoriteRender}
				</div>
			</Listitem>
		);
	});

	return (
		<div className="pb-0-safe">
			<List>{listitemsRender}</List>
		</div>
	);
}
