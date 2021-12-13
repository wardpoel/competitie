import React from 'react';
import { useMemo, useState } from 'react';
import { useData, useSplat, useHistory, usePending } from 'react-sprout';

import List, { Listitem, ListitemSpinner, ListitemText } from '../../components/list.jsx';
import TagIcon from '../../components/tag-icon.jsx';
import Suspense from '../../views/suspense.jsx';
import BackButton from '../../components/back-button.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

import sort from '../../vttl/divisions/sort.js';
import groupBy from '../../utilities/array/group-by.js';
import toSentenceCase from '../../utilities/string/to-sentence-case.js';
import DivisionIcon from '../../components/division-icon.jsx';

export default function Index() {
	let splat = useSplat();
	let history = useHistory();
	let pending = usePending();
	let [selectedDivision, setSelectedDivision] = useState();
	let divisionIndexName = toSentenceCase(splat[splat.length - 1]);

	function handleDivisionSelect(event, division) {
		setSelectedDivision(division);
		history.navigate(`/divisions/${division.id}`, { sticky: true });
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex gap-4">
					<BackButton />
					<ApplicationBarTitle>{divisionIndexName}</ApplicationBarTitle>
				</div>
			</ApplicationBar>
			<div className="overflow-y-auto focus:outline-none">
				<Suspense>
					<DivisionsList pending={pending} selected={selectedDivision} onSelect={handleDivisionSelect} />
				</Suspense>
			</div>
		</div>
	);
}

function DivisionsList(props) {
	let { pending, selected, onSelect } = props;

	let splat = useSplat();
	let divisions = useData();
	let divisionsPath = splat.join('/');
	let divisionsByPath = useMemo(() => {
		let result = groupBy(divisions, 'path');
		for (let path in result) {
			result[path] = sort(result[path]);
		}
		return result;
	}, [divisions]);

	let listitemsRender = divisionsByPath[divisionsPath]?.map(function (division) {
		function handleClick(event) {
			onSelect?.(event, division);
		}

		let listitemSpinnerRender;
		if (pending && selected === division) {
			listitemSpinnerRender = <ListitemSpinner />;
		}

		return (
			<Listitem key={division.id} onClick={handleClick}>
				<div className="grid gap-4 grid-cols-[auto,minmax(0,1fr),auto] items-center">
					<DivisionIcon division={division} />
					<ListitemText>{division.shortname}</ListitemText>
					{listitemSpinnerRender}
				</div>
			</Listitem>
		);
	});

	return (
		<div className="pb-0-safe">
			<List>{listitemsRender}</List>
		</div>
	);
}
