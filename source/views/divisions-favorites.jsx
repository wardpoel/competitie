import { useState } from 'react';
import { useNavigate, usePending } from 'react-sprout';

import useLocalStorageState from '../hooks/use-local-storage-state.js';
import DivisionList from './division-list.jsx';

export default function DivisionsFavorites() {
	let pending = usePending();
	let navigate = useNavigate();

	let [selected, setSelected] = useState();
	let [favoriteDivisions, setFavoriteDivisions] = useLocalStorageState('favoritesDivisions', []);
	let [divisions] = useState(favoriteDivisions);

	if (divisions.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No favorite divisions found</div>;
	} else {
		function handleFavoriteChange(event, division, favorite) {
			let { id } = division;

			if (favorite) {
				setFavoriteDivisions([...favoriteDivisions, division]);
			} else {
				setFavoriteDivisions(favoriteDivisions.filter(division => division.id != id));
			}
		}

		function handleSelect(event, division) {
			setSelected(division);
			navigate(`/divisions/${division.id}`, { sticky: true });
		}

		return (
			<DivisionList
				divisions={divisions}
				favorites={favoriteDivisions}
				pending={pending}
				selected={selected}
				onFavoriteChange={handleFavoriteChange}
				onSelect={handleSelect}
			/>
		);
	}
}
