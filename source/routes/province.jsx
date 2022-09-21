import React from 'react';
import { useRef, useState, useMemo } from 'react';
import { usePending, useData, useParams, useSearch, useHistory } from 'react-sprout';
import { getClubs } from 'vttl-api';

import List, { Listitem, ListitemText, ListitemSubtext, ListitemSpinner } from '../components/list.jsx';
import Suspense from '../views/suspense.jsx';
import BackButton from '../components/back-button.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar.jsx';

import { provincesByUrl } from '../vttl/provinces.js';

import useDerivedState from '../hooks/use-derived-state.js';
import SearchInput from '../views/search-input.jsx';

export async function fetchProvinceClubs(params) {
	let province = provincesByUrl[params.provinceUrl];
	if (province) {
		return await getClubs({ ClubCategory: province.id });
	}
}

export default function Province() {
	let params = useParams();
	let search = useSearch();
	let mainRef = useRef();
	let pending = usePending();
	let history = useHistory();
	let [selectedClub, setSelectedClub] = useState();
	let province = provincesByUrl[params.provinceUrl];

	let [searchValue, setSearchValue] = useDerivedState(search.search ?? '');
	let [filterValue, setFilterValue] = useState(searchValue);

	function handleSearchInputChange(event, value) {
		if (value === '') {
			setFilterValue(value);
			history.replaceState(null, null, 'clubs');
		}

		setSearchValue(value);
	}

	function handleSearchFormSubmit(event) {
		event.preventDefault();

		if (searchValue !== '') {
			setFilterValue(searchValue);
			mainRef.current.focus();
			window.history.replaceState(null, null, `clubs?search=${encodeURIComponent(searchValue)}`);
		}
	}

	function handleClubSelect(event, club) {
		setSelectedClub(club);
		history.navigate(`/clubs/${club.id}`, { sticky: true });
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid gap-4">
					<div className="flex gap-4">
						<BackButton />
						<ApplicationBarTitle>{province?.name}</ApplicationBarTitle>
					</div>

					<form className="grid" onSubmit={handleSearchFormSubmit}>
						<SearchInput value={searchValue} onChange={handleSearchInputChange} />
					</form>
				</div>
			</ApplicationBar>

			<div ref={mainRef} className="overflow-y-auto focus:outline-none" tabIndex={-1}>
				<Suspense>
					<ClubList pending={pending && selectedClub} filter={filterValue} onSelect={handleClubSelect} />
				</Suspense>
			</div>
		</div>
	);
}

function ClubList(props) {
	let { pending, filter, onSelect } = props;

	let clubs = useData();
	let clubsFiltered = useMemo(() => {
		let normalizedFilter = filter.toLowerCase();
		return clubs.filter(function (club) {
			let id = club.id.toLowerCase();
			let name = club.name.toLowerCase();
			let longname = club.longname.toLowerCase();
			return (
				id.includes(normalizedFilter) || name.includes(normalizedFilter) || longname.includes(normalizedFilter)
			);
		});
	}, [clubs, filter]);

	let listitemsRender = clubsFiltered.map(function (club) {
		function handleClick(event) {
			onSelect?.(event, club);
		}

		let listitemDecorationRender;
		if (club === pending) {
			listitemDecorationRender = <ListitemSpinner />;
		} else {
			listitemDecorationRender = <ListitemSubtext>{club.id}</ListitemSubtext>;
		}
		return (
			<Listitem key={club.id} onClick={handleClick}>
				<div className="grid gap-4 grid-cols-[minmax(0,1fr),auto] items-y-center">
					<ListitemText>{club.longname}</ListitemText>
					{listitemDecorationRender}
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
