import React from 'react';

import List, { Listitem, ListitemSpinner, ListitemText } from '../components/list';
import TagIcon from '../components/tag-icon';
import MatchBadge from '../components/match-badge.jsx';

import color from '../vttl/color';
import letter from '../vttl/teams/letter.js';
import groupBy from '../utilities/array/group-by';

export default function MatchList(props) {
	let { club, team, matches, pending, selected, onSelect } = props;

	let matchListitemsRender = [];
	let matchesByCategoryColor = groupBy(matches, m => color(m.division.category, m.division.name));
	let matchIconIsVisible = Object.keys(matchesByCategoryColor).length > 1;
	for (let color in matchesByCategoryColor) {
		matchesByCategoryColor[color].map(function (match) {
			let key = match.id ?? match.name;
			let isHomeMatch;
			let isAwayMatch;
			if (club != undefined) {
				isHomeMatch = match.home.club === club;
				isAwayMatch = match.away.club === club;
			}
			if (team != undefined) {
				isHomeMatch = isHomeMatch && letter(match.home.team) === team;
				isAwayMatch = isAwayMatch && letter(match.away.team) === team;
			}

			let decorationRender;
			if (pending && match === selected) {
				decorationRender = <ListitemSpinner />;
			} else {
				decorationRender = <MatchBadge match={match} home={isHomeMatch} away={isAwayMatch} />;
			}

			let matchIconRender;
			if (matchIconIsVisible) {
				matchIconRender = <TagIcon color={color} />;
			}

			function handleClick(event) {
				if (match.date && match.time) {
					onSelect?.(event, match);
				}
			}

			let matchListitemRender = (
				<Listitem key={key} onClick={handleClick}>
					<div className="flex items-center gap-4">
						{matchIconRender}
						<div className="grid grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] items-y-center flex-grow gap-2">
							<ListitemText align="left" emphasize={isHomeMatch}>
								{match.home.team}
							</ListitemText>
							<div>{decorationRender}</div>
							<ListitemText align="right" emphasize={isAwayMatch}>
								{match.away.team}
							</ListitemText>
						</div>
					</div>
				</Listitem>
			);

			matchListitemsRender.push(matchListitemRender);
		});
	}

	return <List>{matchListitemsRender}</List>;
}
