import { useState } from 'react';
import { useNavigate, usePending } from 'react-sprout';

import List, { Listitem, ListitemSpinner, ListitemText } from '../components/list.jsx';
import DivisionIcon from '../components/division-icon.jsx';

import useLocalStorageState from '../hooks/use-local-storage-state.js';
import FavoriteIcon from '../components/favorite-icon.jsx';

export default function DivisionsFavorites() {
	let pending = usePending();
	let navigate = useNavigate();

	let [selected, setSelected] = useState();
	let [favoriteDivisions, setFavoriteDivisions] = useLocalStorageState('favoritesDivisions', []);
	let [divisions] = useState(favoriteDivisions);

	if (divisions.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No favorite divisions found</div>;
	} else {
		let favoriteDivisionsListitemsRender = divisions.map(function (division) {
			let { id } = division;

			function handleIconClick(event) {
				event.stopPropagation();
			}

			function handleFavoriteChange(event, favorite) {
				if (favorite) {
					setFavoriteDivisions([...favoriteDivisions, division]);
				} else {
					setFavoriteDivisions(favoriteDivisions.filter(division => division.id != id));
				}
			}

			function handleListitemClick() {
				setSelected(division);
				navigate(`/divisions/${division.id}`, { sticky: true });
			}

			let favorite = favoriteDivisions.some(division => division.id == id);

			let listitemDecorationRender;
			if (pending && selected === division) {
				listitemDecorationRender = <ListitemSpinner />;
			} else {
				listitemDecorationRender = (
					<FavoriteIcon defaultValue={favorite} onChange={handleFavoriteChange} onClick={handleIconClick} />
				);
			}

			return (
				<Listitem key={division.id} onClick={handleListitemClick}>
					<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-center">
						<DivisionIcon division={division} />
						<ListitemText>{division.name}</ListitemText>
						{listitemDecorationRender}
					</div>
				</Listitem>
			);
		});

		return <List>{favoriteDivisionsListitemsRender}</List>;
	}
}
