import React from 'react';

import { DateTime } from 'luxon';
import { useState } from 'react';
import { getMatches } from 'vttl-api';
import { useData, useHistory, usePending } from 'react-sprout';
import {
	NearMeIcon,
	PhoneIcon,
	ScheduleIcon,
	SensorDoorIcon,
	CalendarTodayIcon,
	InfoIcon,
	BarChartIcon,
} from 'material-icons';

import List, { Listitem, ListitemSpinner, ListitemText } from '../components/list.jsx';
import Avatar from '../components/avatar.jsx';
import BackButton from '../components/back-button';
import ScoreBadge from '../components/score-badge.jsx';
import IconButton from '../components/icon-button.jsx';

import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';

import score from '../vttl/score.js';
import letter from '../vttl/teams/letter.js';
import toTitleCase from '../utilities/string/to-title-case.js';

export async function fetchMatch(params, splat) {
	if (splat.length === 1) {
		let [matchId] = splat;
		let [match] = await getMatches({ MatchUniqueId: matchId, ShowDivisionName: 'yes', WithDetails: true });
		return match;
	} else if (splat.length === 2) {
		let [divisionId, matchId] = splat;
		let [match] = await getMatches({
			DivisionId: divisionId,
			MatchId: decodeURIComponent(matchId),
			ShowDivisionName: 'yes',
			WithDetails: true,
		});
		return match;
	}
}

export default function Match() {
	let match = useData();
	let history = useHistory();

	let render;
	if (match.id) {
		render = <PlayedMatch match={match} />;
	} else {
		render = <UnplayedMatch match={match} />;
	}

	let subtitleRender;
	if (history.state?.division) {
		subtitleRender = <div className="col-[2] truncate">{match.division.name}</div>;
	} else {
		function handleSubtitleClick() {
			history.navigate(`/divisions/${match.division.id}`);
		}

		subtitleRender = (
			<div className="col-[2] truncate cursor-pointer" onClick={handleSubtitleClick}>
				{match.division.name}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] gap-x-4">
					<BackButton />
					<ApplicationBarTitle>
						{match.home.team} - {match.away.team}
					</ApplicationBarTitle>
					{subtitleRender}
				</div>
			</ApplicationBar>

			<div className="overflow-y-auto">{render}</div>
		</div>
	);
}

function PlayedMatch(props) {
	let { club, team, match } = props;

	let history = useHistory();
	let pending = usePending();

	let [busyPlayer, setBusyPlayer] = useState();
	let [selectedPlayer, setSelectedPlayer] = useState();

	let matchScore = score(match.score);
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

	function handlePlayerSelect(event, player) {
		setSelectedPlayer(player);
	}

	function handlePlayerResult(event, player) {
		setBusyPlayer(player);
		history.navigate(`/players/${player.id}`, { sticky: true });
	}

	return (
		<div className="grid grid-cols-1 gap-2 p-4">
			<div className="grid items-x-center">
				<ScoreBadge score={matchScore} home={true} away={true} />
			</div>

			<TeamList
				{...match.home}
				busy={busyPlayer}
				games={match.games}
				pending={pending}
				selected={selectedPlayer}
				onSelect={handlePlayerSelect}
				onResult={handlePlayerResult}
			/>
			<TeamList
				{...match.away}
				busy={busyPlayer}
				games={match.games}
				pending={pending}
				selected={selectedPlayer}
				onSelect={handlePlayerSelect}
				onResult={handlePlayerResult}
			/>

			<hr />

			<MatchList
				homePlayers={match.home.players}
				awayPlayers={match.away.players}
				games={match.games}
				selected={selectedPlayer}
			/>
		</div>
	);
}

function TeamList(props) {
	let { club, team, score, captain, games, players, busy, pending, selected, onSelect, onResult } = props;

	let hasSelectedPlayer = players.some(player => player === selected);
	let playerListitemsRender = players.map(function (player) {
		let name = toTitleCase(player.firstname) + ' ' + toTitleCase(player.lastname);
		let color;
		if (hasSelectedPlayer) {
			color = player === selected;
		} else if (selected) {
			let game = games.find(function (game) {
				let includesPlayer = game.home.player.id === player.id || game.away.player.id === player.id;
				let includesSelectedPlayer = game.home.player.id == selected.id || game.away.player.id == selected.id;
				return includesPlayer && includesSelectedPlayer;
			});

			if (game) {
				let playerScore = [game.home, game.away].find(score => score.player.id == player.id).sets;
				let selectedScore = [game.home, game.away].find(score => score.player.id == selected.id).sets;

				if (playerScore != undefined && selectedScore != undefined) {
					color = selectedScore > playerScore ? 'green' : 'red';
				}
			}
		}

		function handleClick(event) {
			onSelect?.(event, player);
		}

		function handleResultsButtonClick(event) {
			event.stopPropagation();
			onResult?.(event, player);
		}

		let listitemDecorationRender;
		if (pending && busy === player) {
			listitemDecorationRender = (
				<div className="mx-0.5">
					<ListitemSpinner />
				</div>
			);
		} else {
			listitemDecorationRender = <IconButton icon={BarChartIcon} onClick={handleResultsButtonClick} />;
		}

		return (
			<Listitem key={player.id} onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr),auto,auto] items-y-center gap-4">
					<Avatar color={color}>{player.ranking}</Avatar>
					<div className="flex flex-col">
						<ListitemText>{name}</ListitemText>
					</div>
					<ListitemText>{player.victories}</ListitemText>
					{listitemDecorationRender}
				</div>
			</Listitem>
		);
	});

	return (
		<div>
			<div className="font-bold">{team}</div>
			<div className="-mx-4">
				<List>{playerListitemsRender}</List>
			</div>
		</div>
	);
}

function MatchList(props) {
	let { homePlayers, awayPlayers, games, selected } = props;

	let gameListitemsRender = games.map(function (game) {
		let homePlayer = homePlayers[game.home.player.index - 1];
		let awayPlayer = awayPlayers[game.away.player.index - 1];

		if (homePlayer && awayPlayer) {
			let homePlayerName = toTitleCase(homePlayer.firstname) + ' ' + toTitleCase(homePlayer.lastname);
			let awayPlayerName = toTitleCase(awayPlayer.firstname) + ' ' + toTitleCase(awayPlayer.lastname);

			let isHomeGame = selected && game.home.player.id == selected.id;
			let isAwayGame = selected && game.away.player.id == selected.id;

			let setsRender;
			if (game.score?.length) {
				setsRender = game.score.map(function (set, index) {
					return (
						<ScoreBadge
							key={index}
							score={[set.home, set.away]}
							home={isHomeGame}
							away={isAwayGame}
							size="small"
						/>
					);
				});
			} else if (game.home.sets != undefined && game.away.sets != undefined) {
				setsRender = (
					<ScoreBadge score={[game.home.sets, game.away.sets]} home={isHomeGame} away={isAwayGame} />
				);
			} else {
				setsRender = <div className="flex justify-center w-full min-h-8">-</div>;
			}

			return (
				<Listitem key={game.position}>
					<div className="grid grid-cols-2 py-2 auto-rows-auto gap-x-4 gap-y-2">
						<ListitemText align="left">{homePlayerName}</ListitemText>
						<ListitemText align="right">{awayPlayerName}</ListitemText>
						<div className="col-[1/3] flex gap-2 justify-center flex-wrap">{setsRender}</div>
					</div>
				</Listitem>
			);
		}
	});

	return (
		<div className="-mx-4">
			<List>{gameListitemsRender}</List>
		</div>
	);
}

function UnplayedMatch(props) {
	let { match } = props;

	let datetimeRender;
	if (match.date && match.time) {
		let date = DateTime.fromISO(match.date).toFormat('d LLLL y');
		let time = DateTime.fromISO(match.time).toFormat('T');

		datetimeRender = (
			<>
				<Listitem>
					<div className="flex gap-4">
						<CalendarTodayIcon className="w-6 h-6" />
						<ListitemText>{date}</ListitemText>
						<ScheduleIcon className="w-6 h-6" />
						<ListitemText>{time}</ListitemText>
					</div>
				</Listitem>
			</>
		);
	}

	let nameListitemRender;
	if (match.venue.name != undefined) {
		nameListitemRender = (
			<Listitem>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<SensorDoorIcon className="w-6 h-6" />
					<ListitemText>{match.venue.name}</ListitemText>
				</div>
			</Listitem>
		);
	}

	let addressListitemRender;
	if (match.venue.street != undefined && match.venue.town != undefined) {
		function handleClick() {
			let addressUrl = encodeURIComponent(`${match.venue.street} ${match.venue.town}`);
			let addressMapUrl = `http://maps.google.com/maps?daddr=${addressUrl}`;
			window.open(addressMapUrl, '_blank', 'rel="noreferrer"');
		}

		addressListitemRender = (
			<Listitem onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<NearMeIcon className="w-6 h-6" />
					<ListitemText>
						<div className="flex flex-col items-start">
							<span>{match.venue.street}</span>
							<span>{match.venue.town}</span>
						</div>
					</ListitemText>
				</div>
			</Listitem>
		);
	}

	let phoneListitemRender;
	if (match.venue.phone != undefined && match.venue.phone != '') {
		function handleClick() {
			window.open(`tel:${match.venue.phone}`, '_blank', 'rel="noreferrer"');
		}

		phoneListitemRender = (
			<Listitem onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<PhoneIcon className="w-6 h-6" />
					<ListitemText>{match.venue.phone}</ListitemText>
				</div>
			</Listitem>
		);
	}

	let commentListitemRender;
	if (match.venue.comment) {
		commentListitemRender = (
			<Listitem>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-start gap-4 py-2">
					<InfoIcon className="w-6 h-6" />
					<div>{match.venue.comment}</div>
				</div>
			</Listitem>
		);
	}

	return (
		<div className="">
			<List>
				{nameListitemRender}
				{addressListitemRender}
				{phoneListitemRender}
				{datetimeRender}
				{commentListitemRender}
			</List>
		</div>
	);
}
