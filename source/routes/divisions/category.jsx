import { useMemo, useState } from 'react';
import { useData, useSplat, useHistory, usePending } from 'react-sprout';

import Suspense from '../../views/suspense.jsx';
import BackButton from '../../components/back-button.jsx';
import DivisionList from '../../views/division-list.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

import sort from '../../vttl/divisions/sort.js';
import groupBy from '../../utilities/array/group-by.js';
import toSentenceCase from '../../utilities/string/to-sentence-case.js';

import useLocalStorageState from '../../hooks/use-local-storage-state.js';

export default function Category() {
	let splat = useSplat();
	let history = useHistory();
	let pending = usePending();
	let [favoriteDivisions, setFavoriteDivisions] = useLocalStorageState('favoritesDivisions', []);
	let [selected, setSelected] = useState();
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
		setSelected(division);
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
						selected={selected}
						favorites={favoriteDivisions}
						onSelect={handleDivisionSelect}
						onFavoriteChange={handleFavoriteChange}
					/>
				</Suspense>
			</div>
		</div>
	);
}

function DivisionsList(props) {
	let splat = useSplat();
	let divisionsAll = useData();
	let divisionsPath = splat.join('/');
	let divisionsByPath = useMemo(() => {
		let result = groupBy(divisionsAll, 'path');
		for (let path in result) {
			result[path] = sort(result[path]);
		}
		return result;
	}, [divisionsAll]);

	let divisions = divisionsByPath[divisionsPath];

	return (
		<div className="pb-0-safe">
			<DivisionList name="short" divisions={divisions} {...props} />
		</div>
	);
}
