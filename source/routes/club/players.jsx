import React from 'react';

import { useState } from 'react';
import { useData, useHistory, useSearch, usePending } from 'react-sprout';
import { getMembers } from 'vttl-api';

import List, { Listitem, ListitemText, ListitemSubtext, ListitemSpinner } from '../../components/list.jsx';
import Avatar from '../../components/avatar.jsx';
import Suspense from '../../views/suspense';
import CategorySelect from '../../views/category-select.jsx';

import toTitleCase from '../../utilities/string/to-title-case.js';

export function fetchClubPlayers(params, splat, search) {
	return getMembers({ Club: params.clubId, PlayerCategory: search.category ?? 1 });
}

export default function ClubPlayers() {
	let search = useSearch();
	let history = useHistory();
	let pending = usePending();
	let [selectedPlayer, setSelectedPlayer] = useState();

	let categoryId = search.category ?? 1;

	function handleCategoryChange(event, value) {
		history.navigate(`?category=${value}`, { replace: true });
	}

	function handlePlayerSelect(event, player) {
		setSelectedPlayer(player);
		history.navigate(`/players/${player.id}/results?categoryId=${categoryId}`, {
			sticky: true,
			state: { club: true },
		});
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[minmax(0,1fr),auto]">
			<Suspense>
				<PlayersList
					key={categoryId}
					pending={pending}
					selected={selectedPlayer}
					onSelect={handlePlayerSelect}
				/>
			</Suspense>
			<div className="z-20 p-2 bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-outer pb-2-safe">
				<CategorySelect defaultValue={categoryId} onChange={handleCategoryChange} />
			</div>
		</div>
	);
}

function PlayersList(props) {
	let { pending, selected, onSelect } = props;

	let players = useData();
	if (players.length === 0) {
		return <div className="grid items-x-center items-y-center">No players found</div>;
	}

	let playerListitemsRender = players.map(function (player) {
		let { id, firstname, lastname, position, index, ranking } = player;

		let playerName = toTitleCase(firstname) + ' ' + toTitleCase(lastname);
		let playerInfo = id + ' - index ' + index;

		function handleClick(event) {
			onSelect?.(event, player);
		}

		let listitemDecorationRender;
		if (pending && player === selected) {
			listitemDecorationRender = <ListitemSpinner />;
		} else {
			listitemDecorationRender = <ListitemText>{ranking}</ListitemText>;
		}

		return (
			<Listitem key={id} onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-y-center">
					<Avatar>{position}</Avatar>
					<div className="flex flex-col">
						<ListitemText>{playerName}</ListitemText>
						<ListitemSubtext>{playerInfo}</ListitemSubtext>
					</div>
					{listitemDecorationRender}
				</div>
			</Listitem>
		);
	});

	return <List>{playerListitemsRender}</List>;
}
