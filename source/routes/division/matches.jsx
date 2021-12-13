import React, { useLayoutEffect, useMemo, useState } from 'react';

import { DateTime } from 'luxon';
import { getMatches } from 'vttl-api';
import { useSearch, useData, useResult, useHistory, usePending } from 'react-sprout';

import Suspense from '../../views/suspense.jsx';
import MatchList from '../../views/match-list.jsx';
import IconButton from '../../components/icon-button.jsx';
import ChevronLeftIcon from '../../icons/chevron-left.jsx';
import ChevronRightIcon from '../../icons/chevron-right.jsx';

import { useSetDivisionName } from '../division.jsx';

export async function fetchDivisionMatches(params, splat, search) {
	let date = search.date ? DateTime.fromFormat(search.date, 'dd-LL-yyyy') : DateTime.local();
	let start = date.startOf('week').toISODate();
	let finish = date.endOf('week').toISODate();
	let matches = await getMatches({
		DivisionId: params.divisionId,
		YearDateFrom: start,
		YearDateTo: finish,
		ShowDivisionName: 'yes',
	});

	if (matches.length) {
		return matches;
	} else {
		if (search.action === 'previous') {
			matches = await getMatches({
				DivisionId: params.divisionId,
				YearDateTo: finish,
				ShowDivisionName: 'yes',
			});

			function findHighest(date, match) {
				return match.date && match.date > date ? match.date : date;
			}

			let highestDate = matches.reduce(findHighest, '0000-01-01');
			let higherDate = DateTime.fromISO(highestDate).startOf('week').toISODate();
			return matches.filter(match => match.date > higherDate);
		} else {
			matches = await getMatches({
				DivisionId: params.divisionId,
				YearDateFrom: start,
				ShowDivisionName: 'yes',
			});

			function findLowest(date, match) {
				return match.date && match.date < date ? match.date : date;
			}

			let lowestDate = matches.reduce(findLowest, '9999-12-31');
			let lowerDate = DateTime.fromISO(lowestDate).endOf('week').toISODate();
			return matches.filter(match => match.date < lowerDate);
		}
	}
}

export default function DivisionMatches() {
	let matches = useResult();
	let history = useHistory();
	let pending = usePending();
	let setDivisionName = useSetDivisionName();
	let [startDate, setStartDate] = useState();
	let [finishDate, setFinishDate] = useState();
	let [selectedMatch, setSelectedMatch] = useState();

	let start;
	let finish;
	if (matches?.length) {
		let match = matches.find(match => match.date != undefined);
		if (match) {
			let date = DateTime.fromISO(match.date);

			start = date.startOf('week');
			finish = date.endOf('week');
		}
	}

	let startLabelRender = start?.toFormat('dd-LL-yyyy') ?? startDate;
	let finishLabelRender = finish?.toFormat('dd-LL-yyyy') ?? finishDate;

	useLayoutEffect(() => {
		let match = matches?.[0];
		if (match) {
			setDivisionName(match.division.name);
		}
	}, [setDivisionName, matches]);

	function handleMatchSelect(event, match) {
		setSelectedMatch(match);
		let matchUrl;
		if (match.id) {
			matchUrl = `/matches/${match.id}`;
		} else {
			matchUrl = `/matches/${match.division.id}/${encodeURIComponent(match.name)}`;
		}
		history.navigate(matchUrl, { sticky: true, state: { division: true } });
	}

	function handlePrevClick() {
		if (start) {
			setStartDate(startLabelRender);
			setFinishDate(finishLabelRender);

			history.navigate(
				`?date=${start.minus({ days: 1 }).startOf('week').toFormat('dd-LL-yyyy')}&action=previous`,
				{
					replace: true,
				},
			);
		}
	}

	function handleNextClick() {
		if (finish) {
			setStartDate(startLabelRender);
			setFinishDate(finishLabelRender);

			history.navigate(`?date=${finish.plus({ days: 1 }).startOf('week').toFormat('dd-LL-yyyy')}&action=next`, {
				replace: true,
			});
		}
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[minmax(0,1fr),auto]">
			<div className="overflow-y-auto">
				<Suspense>
					<DivisionMatchList pending={pending} selected={selectedMatch} onSelect={handleMatchSelect} />
				</Suspense>
			</div>

			<div className="grid grid-cols-[auto,minmax(0,1fr),auto] shadow-outer text-zinc-300 p-4 bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 auto-cols-auto items-y-center pb-4-safe">
				<IconButton shade="light" icon={ChevronLeftIcon} onClick={handlePrevClick} />
				<div className="grid items-x-center">
					{startLabelRender} • {finishLabelRender}
				</div>
				<IconButton shade="light" icon={ChevronRightIcon} onClick={handleNextClick} />
			</div>
		</div>
	);
}

function DivisionMatchList(props) {
	let { pending, selected, onSelect } = props;

	let matches = useData();
	if (matches.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No matches found</div>;
	} else {
		return <MatchList matches={matches} pending={pending} selected={selected} onSelect={onSelect} />;
	}
}
