import { useState, useRef, useMemo } from 'react';
import { useData, useSearch, useHistory, usePending } from 'react-sprout';
import { getMembers } from 'vttl-api';

import List, { Listitem, ListitemSpinner, ListitemSubtext, ListitemText } from '../components/list.jsx';
import Avatar from '../components/avatar.jsx';
import Suspense from '../views/suspense.jsx';
import SearchInput from '../views/search-input.jsx';
import FavoriteIcon from '../components/favorite-icon.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';

import useLocalStorageState from '../hooks/use-local-storage-state.js';

import sortBy from '../utilities/array/sort-by.js';
import toTitleCase from '../utilities/string/to-title-case.js';

export async function fetchPlayers(params, splat, search) {
	if (search.search) {
		let uniqueIdRegex = /^\d+$/;
		if (uniqueIdRegex.test(search.search)) {
			return getMembers({ UniqueIndex: parseInt(search.search, 10) });
		} else {
			return getMembers({ NameSearch: search.search });
		}
	}
}

export default function Players() {
	let search = useSearch();
	let history = useHistory();
	let mainRef = useRef();
	let [selected, setSelected] = useState();
	let [searchValue, setSearchValue] = useState(search.search ?? '');
	let [favoritePlayers, setFavoritePlayers] = useLocalStorageState('favoritedPlayers', []);
	let [players, setPlayers] = useState(favoritePlayers);

	let sortedPlayers = useMemo(() => sortBy(players, 'ranking', 'id'), [players]);

	function handleSearchInputChange(event, value) {
		if (value === '') {
			if (search.search) {
				setPlayers(favoritePlayers);
			}

			history.navigate('players', { replace: true });
		}

		setSearchValue(value);
	}

	function handleSearchFormSubmit(event) {
		event.preventDefault();
		mainRef.current.focus();

		if (searchValue !== '') {
			history.navigate(`players?search=${encodeURIComponent(searchValue)}`, { replace: true });
		}
	}

	function handleFavoriteChange(event, player, favorite) {
		let { id } = player;

		if (favorite) {
			setFavoritePlayers([...favoritePlayers, player]);
		} else {
			setFavoritePlayers(favoritePlayers.filter(player => player.id != id));
		}
	}

	function handleSelect(event, player) {
		setSelected(player);
		history.navigate(`/players/${player.id}`, { sticky: true });
	}

	let render;
	if (search.search) {
		render = (
			<PlayerList
				favorites={favoritePlayers}
				selected={selected}
				onFavoriteChange={handleFavoriteChange}
				onSelect={handleSelect}
			/>
		);
	} else if (players.length) {
		render = (
			<PlayersList
				players={sortedPlayers}
				selected={selected}
				favorites={favoritePlayers}
				onFavoriteChange={handleFavoriteChange}
				onSelect={handleSelect}
			/>
		);
	} else {
		render = <div className="grid w-full h-full items-x-center items-y-center">No favorite players found</div>;
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid gap-4">
					<ApplicationBarTitle>Players</ApplicationBarTitle>
					<form className="grid" onSubmit={handleSearchFormSubmit}>
						<SearchInput value={searchValue} onChange={handleSearchInputChange} />
					</form>
				</div>
			</ApplicationBar>
			<div ref={mainRef} className="overflow-y-auto focus:outline-none" tabIndex={-1}>
				<Suspense>{render}</Suspense>
			</div>
		</div>
	);
}

function PlayerList(props) {
	let players = useData();

	return <PlayersList players={players} {...props} />;
}

export function PlayersList(props) {
	let { players, selected, favorites, onFavoriteChange, onSelect } = props;

	let pending = usePending();

	if (players.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No players found</div>;
	} else {
		let playerListitemsRender = players.map(function (player) {
			let { id, firstname, lastname, ranking } = player;

			let name = `${toTitleCase(firstname)} ${toTitleCase(lastname)}`;
			let favorite = favorites.find(player => player.id == id);

			function handleIconClick(event) {
				event.stopPropagation();
			}

			function handleFavoriteChange(event, favorite) {
				onFavoriteChange?.(event, player, favorite);
			}

			function handleListitemClick(event) {
				onSelect(event, player);
			}

			let listitemDecorationRender;
			if (pending && player === selected) {
				listitemDecorationRender = <ListitemSpinner />;
			} else {
				listitemDecorationRender = (
					<FavoriteIcon defaultValue={favorite} onChange={handleFavoriteChange} onClick={handleIconClick} />
				);
			}

			return (
				<Listitem key={id} role="link" onClick={handleListitemClick}>
					<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-y-center">
						<Avatar>{ranking}</Avatar>

						<div className="flex flex-col">
							<ListitemText>{name}</ListitemText>
							<ListitemSubtext>{id}</ListitemSubtext>
						</div>
						{listitemDecorationRender}
					</div>
				</Listitem>
			);
		});

		return <List>{playerListitemsRender}</List>;
	}
}
