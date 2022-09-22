import List, { Listitem, ListitemText, ListitemSpinner } from '../components/list.jsx';
import DivisionIcon from '../components/division-icon.jsx';
import FavoriteIcon from '../components/favorite-icon.jsx';

export default function DivisionList(props) {
	let { name, divisions, favorites, pending, selected, onFavoriteChange, onSelect } = props;

	if (divisions.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No divisions found</div>;
	} else {
		let listitemsRender = divisions.map(function (division) {
			let { id } = division;

			function handleClick(event) {
				onSelect?.(event, division);
			}

			function handleFavoriteChange(event, favorite) {
				onFavoriteChange?.(event, division, favorite);
			}

			function handleFavoriteIconClick(event) {
				event.stopPropagation();
			}

			let favorite = favorites.some(division => division.id == id);
			let divisionName = name === 'short' ? division.shortname : division.name;

			let listitemDecorationRender;
			if (pending && selected === division) {
				listitemDecorationRender = <ListitemSpinner />;
			} else {
				listitemDecorationRender = (
					<FavoriteIcon
						defaultValue={favorite}
						onChange={handleFavoriteChange}
						onClick={handleFavoriteIconClick}
					/>
				);
			}

			return (
				<Listitem key={division.id} onClick={handleClick}>
					<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-center">
						<DivisionIcon division={division} />
						<ListitemText>{divisionName}</ListitemText>
						{listitemDecorationRender}
					</div>
				</Listitem>
			);
		});

		return <List>{listitemsRender}</List>;
	}
}
