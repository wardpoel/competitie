import React from 'react';

import { useHistory } from 'react-sprout';

import BackButton from '../../components/back-button.jsx';
import ProvinceList from '../../views/province-list.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

export default function Provincial() {
	let history = useHistory();

	function handleProvinceSelect(event, province) {
		history.navigate(`/divisions/provincial/${province.url}/`);
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex gap-4">
					<BackButton />
					<ApplicationBarTitle>Provincial</ApplicationBarTitle>
				</div>
			</ApplicationBar>
			<div className="overflow-y-auto pb-0-safe">
				<ProvinceList onSelect={handleProvinceSelect} />
			</div>
		</div>
	);
}
