import React, { createContext, useContext, useRef } from 'react';

import { useState } from 'react';
import { useSplat, useHistory } from 'react-sprout';

import Tabs, { Tab } from '../components/tabs';
import Suspense from '../views/suspense';
import BackButton from '../components/back-button';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';

import { EmojiEventsIcon, FitnessCenterIcon } from 'material-icons';

export let SetDivisionNameContext = createContext();

export function useSetDivisionName() {
	return useContext(SetDivisionNameContext);
}

export default function Division(props) {
	let mainRef = useRef();
	let history = useHistory();

	let [tab = 'matches'] = useSplat();
	let [divisionName, setDivisionName] = useState();

	let tabsRender;
	if (history.state?.tabs == undefined || history.state.tabs !== false) {
		tabsRender = (
			<div className="-mx-4 -mb-4">
				<Tabs value={tab} onChange={handleTabChange}>
					<Tab icon={FitnessCenterIcon} label="matches" />
					<Tab icon={EmojiEventsIcon} label="ranking" />
				</Tabs>
			</div>
		);
	}

	function handleTabChange(event, tab) {
		mainRef.current.focus();
		history.navigate(tab, { replace: true });
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex flex-col items-stretch gap-4">
					<div className="flex items-center gap-4 min-h-[1.75rem]">
						<BackButton />
						<ApplicationBarTitle>{divisionName}</ApplicationBarTitle>
					</div>
					{tabsRender}
				</div>
			</ApplicationBar>
			<div ref={mainRef} className="grid grid-cols-1 grid-rows-1 focus:outline-none" tabIndex={-1}>
				<Suspense>
					<SetDivisionNameContext.Provider value={setDivisionName}>
						{props.children}
					</SetDivisionNameContext.Provider>
				</Suspense>
			</div>
		</div>
	);
}
