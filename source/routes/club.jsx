import React, { useContext } from 'react';

import { useRef, createContext } from 'react';
import { getClubs } from 'vttl-api';
import { useData, useHistory, useSplat } from 'react-sprout';

import Tabs, { Tab } from '../components/tabs.jsx';
import Suspense from '../views/suspense.jsx';
import BackButton from '../components/back-button';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';

import InfoIcon from '../icons/info.jsx';
import PeopleIcon from '../icons/people.jsx';
import WidgetsIcon from '../icons/widgets.jsx';
import PlaceIcon from '../icons/place.jsx';
import FitnessCenterIcon from '../icons/fitness-center.jsx';
import AlternateEmailIcon from '../icons/alternate-email.jsx';

const key = 'pk.eyJ1Ijoic3ViaGVybyIsImEiOiJja3BycjNudTAwMmZvMnZubzloeG1seGwwIn0.jhWK_gta_okso5dlvT787Q';

export let ClubContext = createContext();

export function useClub() {
	return useContext(ClubContext);
}

export async function fetchClub({ clubId }) {
	let clubs = await getClubs({ Club: clubId });
	let club = clubs[0];
	if (club?.venues) {
		let venueMapPromises = club.venues.map(async function (venue) {
			let address = encodeURIComponent(`${venue.town} ${venue.street}`);
			let addressUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?country=BE&limit=1&access_token=${key}`;
			let response = await fetch(addressUrl);
			let responseJson = await response.json();
			let coordinates = responseJson.features?.[0]?.center;
			if (coordinates) {
				venue.mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coordinates[0]},${coordinates[1]},16/400x400?attribution=false&logo=false&access_token=${key}`;

				await new Promise(function (resolve) {
					let image = new Image();
					image.src = venue.mapUrl;
					image.onload = resolve;
					image.onerror = resolve;
				});
			}
		});
		await Promise.all(venueMapPromises);
	}
	return club;
}

export default function Club(props) {
	let { children } = props;

	let club = useData();
	let mainRef = useRef();
	let history = useHistory();
	let [tab = 'info'] = useSplat();

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
						<ApplicationBarTitle>{club.longname}</ApplicationBarTitle>
					</div>
				</div>
				<div className="-mx-4 -mb-4">
					<Tabs value={tab} onChange={handleTabChange}>
						<Tab icon={PlaceIcon} label="info" />
						<Tab icon={PeopleIcon} label="players" />
						<Tab icon={WidgetsIcon} label="teams" />
						<Tab icon={FitnessCenterIcon} label="matches" />
					</Tabs>
				</div>
			</ApplicationBar>
			<div ref={mainRef} className="grid grid-cols-1 grid-rows-1 focus:outline-none" tabIndex={-1}>
				<Suspense>
					<ClubContext.Provider value={club}>{children}</ClubContext.Provider>
				</Suspense>
			</div>
		</div>
	);
}
