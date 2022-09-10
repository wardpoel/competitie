import React, { createContext, useContext } from 'react';
import { useRef, useState, Fragment } from 'react';
import { useData, useSplat, useParams, useHistory, useSearch } from 'react-sprout';
import { getMembers, getClubs, getCategories } from 'vttl-api';

import Tabs, { Tab } from '../components/tabs.jsx';
import List, { Listitem, ListitemSubtext, ListitemText } from '../components/list.jsx';
import BackButton from '../components/back-button';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';
import CategorySelect from '../views/category-select.jsx';
import InfoIcon from '../icons/info.jsx';
import BarChartIcon from '../icons/bar-chart.jsx';
import FitnessCenterIcon from '../icons/fitness-center.jsx';

import toTitleCase from '../utilities/string/to-title-case.js';
import sort from '../utilities/array/sort-by.js';
import categoryDescription from '../vttl/category/description.js';
import classnames from '../utilities/string/classnames.js';
import Avatar from '../components/avatar.jsx';

export let playerContext = createContext();

export function usePlayer() {
	return useContext(playerContext);
}

export async function fetchPlayer(params) {
	let club;
	let players = [];

	let categories = await getCategories({ ShortNameSearch: 'ALL' });
	for (let category of categories) {
		let [player] = await getMembers({
			UniqueIndex: params.playerId,
			PlayerCategory: category.id,
			RankingPointsInformation: true,
			WithResults: true,
		});
		if (player) {
			if (club == undefined) {
				[club] = await getClubs({ Club: player.club });
			}

			player.club = club;
			player.category = category;

			players.push(player);
		}
	}

	return players;
}

export default function Player(props) {
	let search = useSearch();
	let mainRef = useRef();
	let players = useData();
	let history = useHistory();

	let category = search.category ?? 'men';
	let categories = players.map(player => categoryDescription(player.category));
	let player = players.find((player, index) => categories[index] === category);

	let [tab = 'results'] = useSplat();

	function handleTabChange(event, tab) {
		mainRef.current.focus();
		history.navigate(`${tab}?category=${category}`, { replace: true });
	}

	function handleCategoryChange(event, value) {
		history.navigate(`?category=${value}`, { sticky: true, replace: true });
	}

	let titleRender = `${toTitleCase(player.firstname)} ${toTitleCase(player.lastname)}`;
	let subtitleRender;
	if (history.state?.club) {
		subtitleRender = (
			<div className="col-[2] truncate">
				{player.ranking} - {player.club.longname}
			</div>
		);
	} else {
		function handleClick() {
			history.navigate(`/clubs/${player.club.id}`);
		}

		subtitleRender = (
			<div className="col-[2] truncate cursor-pointer" onClick={handleClick}>
				{player.ranking} - {player.club.longname}
			</div>
		);
	}

	let categorySelectRender;
	if (players.length > 1) {
		categorySelectRender = (
			<div className="z-20 p-2 bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-outer pb-2-safe">
				<CategorySelect categories={categories} defaultValue={category} onChange={handleCategoryChange} />
			</div>
		);
	}

	let mainClassName = classnames('overflow-y-auto', categorySelectRender == undefined && 'pb-0-safe');

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] auto-rows-auto">
			<ApplicationBar>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] gap-x-4">
					<BackButton />
					<ApplicationBarTitle>{titleRender}</ApplicationBarTitle>
					{subtitleRender}
				</div>
				<div className="-mx-4 -mb-4">
					<Tabs defaultValue={tab} onChange={handleTabChange}>
						<Tab icon={BarChartIcon} label="results" />
						<Tab icon={FitnessCenterIcon} label="matches" />
					</Tabs>
				</div>
			</ApplicationBar>
			<div ref={mainRef} className={mainClassName}>
				<playerContext.Provider value={player}>{props.children}</playerContext.Provider>
			</div>
			{categorySelectRender}
		</div>
	);
}
