import React from 'react';

import { useState } from 'react';
import { usePlayer } from '../player';
import { useHistory, usePending, useSearch } from 'react-sprout';

import List, { Listitem, ListitemSpinner, ListitemText } from '../../components/list';
import ScoreBadge from '../../components/score-badge';

import groupBy from '../../utilities/array/group-by';
import description from '../../vttl/results/description.js';
import toTitleCase from '../../utilities/string/to-title-case';

export default function PlayerMatches() {
	let player = usePlayer();
	let search = useSearch();
	let pending = usePending();
	let history = useHistory();
	let categoryId = search?.categoryId ?? 1;
	let playerResults = groupBy(player.results, 'date', description);
	let [selectedResult, setSelectedResult] = useState();

	let listitemsRender = [];
	for (let date in playerResults) {
		let [, year, month, day] = date.match(/(\d+)-(\d+)-(\d+)/);

		for (let title in playerResults[date]) {
			let matchListHeaderRender = (
				<ListHeader>
					<div className="flex justify-between">
						<div>{title}</div>
						<div>
							{day}-{month}-{year}
						</div>
					</div>
				</ListHeader>
			);

			let matchListitemsRender = playerResults[date][title].map(function (result, index) {
				let playerName = `${toTitleCase(result.player.lastname)} ${toTitleCase(result.player.firstname)}`;

				function handleClick() {
					setSelectedResult(result);
					history.navigate(`/players/${result.player.id}/results?categoryId=${categoryId}`, {
						sticky: true,
						state: { club: false },
					});
				}

				let listitemDecorationRender;
				if (pending && result === selectedResult) {
					listitemDecorationRender = <ListitemSpinner />;
				} else {
					listitemDecorationRender = <ListitemText>{result.player.ranking}</ListitemText>;
				}

				return (
					<Listitem key={index} onClick={handleClick}>
						<div className="grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-y-center">
							<ScoreBadge score={result.sets} home={true} />
							<ListitemText>{playerName}</ListitemText>
							{listitemDecorationRender}
						</div>
					</Listitem>
				);
			});

			let key = `${date}.${title}`;
			let matchListRender = <List key={title}>{matchListitemsRender}</List>;

			listitemsRender.push(
				<div key={key}>
					{matchListHeaderRender}
					{matchListRender}
				</div>,
			);
		}
	}

	if (listitemsRender.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No matches found</div>;
	}

	return listitemsRender;
}

function ListHeader(props) {
	let { children } = props;

	let style = {
		outlineWidth: 1,
		outlineStyle: 'solid',
		outlineColor: 'rgb(228 228 231)',
	};

	return (
		<div className="sticky top-0 px-4 py-1 text-sm bg-zinc-100 text-zinc-400" style={style}>
			{children}
		</div>
	);
}
