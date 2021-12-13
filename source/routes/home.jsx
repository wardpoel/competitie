import React from 'react';

import { useRef, useState, useMemo, useContext } from 'react';
import { useHistory, useSplat, useLocation } from 'react-sprout';

import NavigationBar, { NavigationBarItem } from '../components/navigation-bar.jsx';

import PeopleIcon from '../icons/people.jsx';
import ExtensionIcon from '../icons/extension.jsx';
import MapsHomeWorkIcon from '../icons/maps-home-work.jsx';
import FitnessCenterIcon from '../icons/fitness-center.jsx';
import PublicIcon from '../icons/public.jsx';
import SensorDoorIcon from '../icons/sensor-door.jsx';

export default function Home(props) {
	let { children } = props;

	let mainRef = useRef();
	let history = useHistory();
	let location = useLocation();
	let [segment] = useSplat();

	function handleNavigationBarChange(event, value) {
		mainRef.current.focus();

		history.navigate(`/${value}`, { replace: true });
	}

	let navigationRender;
	if (location.pathname === '/clubs' || location.pathname === '/players' || location.pathname === '/divisions') {
		navigationRender = (
			<NavigationBar defaultValue={segment} onChange={handleNavigationBarChange}>
				<NavigationBarItem value="clubs" icon={SensorDoorIcon} label="Clubs" />
				<NavigationBarItem value="players" icon={PeopleIcon} label="Players" />
				<NavigationBarItem value="divisions" icon={ExtensionIcon} label="Divisions" />
			</NavigationBar>
		);
	}

	// We put the extra div around children to safeguard against multiple children
	// or no children at all which would screw up our layout
	return (
		<div className="grid grid-cols-1 grid-rows-[minmax(0,1fr),auto]">
			<div ref={mainRef} className="grid grid-cols-1 grid-rows-1" tabIndex={-1}>
				{children}
			</div>
			{navigationRender}
		</div>
	);
}
