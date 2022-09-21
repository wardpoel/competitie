import React from 'react';

import { useClub } from '../club';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { getMatches } from 'vttl-api';
import { useData, useHistory, usePending, useResult, useSearch } from 'react-sprout';

import Suspense from '../../views/suspense';
import MatchList from '../../views/match-list';
import IconButton from '../../components/icon-button';

import { ChevronLeftIcon, ChevronRightIcon } from 'material-icons';

export async function fetchClubMatches(params, splat, search) {
	let date = search.date ? DateTime.fromFormat(search.date, 'dd-LL-yyyy') : DateTime.local();
	let start = date.startOf('week').toISODate();
	let finish = date.endOf('week').toISODate();
	let matches = await getMatches({
		Club: params.clubId,
		YearDateFrom: start,
		YearDateTo: finish,
		ShowDivisionName: 'yes',
	});

	if (matches.length) {
		return matches;
	} else {
		if (search.action === 'previous') {
			matches = await getMatches({
				Club: params.clubId,
				YearDateTo: finish,
				ShowDivisionName: 'yes',
			});

			function findHighest(date, match) {
				return match.date && match.date > date ? match.date : date;
			}

			let highestDate = matches.reduce(findHighest, '0000-01-01');
			let higherDate = DateTime.fromISO(highestDate).startOf('week').toISODate();
			return matches.filter(match => match.date && match.date > higherDate);
		} else {
			matches = await getMatches({
				Club: params.clubId,
				YearDateFrom: start,
				ShowDivisionName: 'yes',
			});

			function findLowest(date, match) {
				return match.date && match.date < date ? match.date : date;
			}

			let lowestDate = matches.reduce(findLowest, '9999-12-31');
			let lowerDate = DateTime.fromISO(lowestDate).endOf('week').toISODate();
			return matches.filter(match => match.date && match.date < lowerDate);
		}
	}
}

export default function ClubMatches() {
	let search = useSearch();
	let matches = useResult();
	let history = useHistory();
	let pending = usePending();
	let [pendingDescription, setPendingDescription] = useState();
	let [selectedMatch, setSelectedMatch] = useState();

	let date;
	let start;
	let finish;
	let description;
	if (matches) {
		let match = matches.find(match => match.date);
		if (match) {
			date = DateTime.fromISO(match.date);
			start = date.startOf('week');
			finish = date.endOf('week');
			description = `${start.toFormat('dd-LL-yyyy')} • ${finish.toFormat('dd-LL-yyyy')}`;
		} else {
			date = search.date ? DateTime.fromFormat(search.date, 'dd-LL-yyyy') : DateTime.local();
			start = date.startOf('week');
			finish = date.endOf('week');
			if (search.action === 'previous') {
				description = finish.toFormat('dd-LL-yyyy');
			} else {
				description = start.toFormat('dd-LL-yyyy');
			}
		}
	} else {
		description = pendingDescription;
	}

	function handleMatchSelect(event, match) {
		setSelectedMatch(match);
		let matchUrl;
		if (match.id) {
			matchUrl = `/matches/${match.id}`;
		} else {
			matchUrl = `/matches/${match.division.id}/${encodeURIComponent(match.name)}`;
		}
		history.navigate(matchUrl, { sticky: true });
	}

	let nextDisable = matches && matches.length === 0 && search.action !== 'previous';
	let prevDisable = matches && matches.length === 0 && search.action === 'previous';
	let nextDisabled = matches == undefined || nextDisable;
	let prevDisabled = matches == undefined || prevDisable;

	function handleNextClick() {
		setPendingDescription(description);

		history.navigate(`?date=${finish.plus({ days: 1 }).startOf('week').toFormat('dd-LL-yyyy')}&action=next`, {
			replace: true,
		});
	}

	function handlePrevClick() {
		setPendingDescription(description);

		history.navigate(`?date=${start.minus({ days: 1 }).startOf('week').toFormat('dd-LL-yyyy')}&action=previous`, {
			replace: true,
		});
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[minmax(0,1fr),auto]">
			<div className="overflow-y-auto">
				<Suspense>
					<ClubMatchList pending={pending} selected={selectedMatch} onSelect={handleMatchSelect} />
				</Suspense>
			</div>

			<div className="grid grid-cols-[auto,minmax(0,1fr),auto] shadow-outer text-zinc-300 p-4 bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 auto-cols-auto items-y-center pb-4-safe">
				<IconButton
					shade="light"
					disable={prevDisable}
					disabled={prevDisabled}
					icon={ChevronLeftIcon}
					onClick={handlePrevClick}
				/>
				<div className="grid items-x-center">{description}</div>
				<IconButton
					shade="light"
					disable={nextDisable}
					disabled={nextDisabled}
					icon={ChevronRightIcon}
					onClick={handleNextClick}
				/>
			</div>
		</div>
	);
}

function ClubMatchList(props) {
	let { pending, selected, onSelect } = props;

	let club = useClub();
	let matches = useData();
	if (matches.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No matches found</div>;
	} else {
		return <MatchList club={club.id} matches={matches} pending={pending} selected={selected} onSelect={onSelect} />;
	}
}
