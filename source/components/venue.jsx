import React from 'react';

import List, { Listitem, ListitemText } from './list.jsx';
import InfoIcon from '../icons/info.jsx';
import PlaceIcon from '../icons/place.jsx';
import PhoneIcon from '../icons/phone.jsx';
import NearMeIcon from '../icons/near-me.jsx';
import SensorDoorIcon from '../icons/sensor-door.jsx';

export default function Venue(props) {
	let { venue } = props;

	let nameListitemRender;
	if (venue.name != undefined) {
		nameListitemRender = (
			<Listitem>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<SensorDoorIcon className="w-6 h-6" />
					<ListitemText>{venue.name}</ListitemText>
				</div>
			</Listitem>
		);
	}

	let addressListitemRender;
	if (venue.street != undefined && venue.town != undefined) {
		function handleClick() {
			let addressUrl = encodeURIComponent(`${venue.street} ${venue.town}`);
			let addressMapUrl = `http://maps.google.com/maps?daddr=${addressUrl}`;
			window.open(addressMapUrl, '_blank', 'rel="noreferrer"');
		}

		addressListitemRender = (
			<Listitem onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<NearMeIcon className="w-6 h-6" />
					<ListitemText>
						<div className="flex flex-col items-start">
							<span>{venue.street}</span>
							<span>{venue.town}</span>
						</div>
					</ListitemText>
				</div>
			</Listitem>
		);
	}

	let phoneListitemRender;
	if (venue.phone != undefined && venue.phone != '') {
		function handleClick() {
			window.open(`tel:${venue.phone}`, '_blank', 'rel="noreferrer"');
		}

		phoneListitemRender = (
			<Listitem onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-center gap-4">
					<PhoneIcon className="w-6 h-6" />
					<ListitemText>{venue.phone}</ListitemText>
				</div>
			</Listitem>
		);
	}

	let commentListitemRender;
	if (venue.comment) {
		commentListitemRender = (
			<Listitem>
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-y-start gap-4 py-2">
					<InfoIcon className="w-6 h-6" />
					<div>{venue.comment}</div>
				</div>
			</Listitem>
		);
	}

	let listRender;
	if (nameListitemRender || addressListitemRender || phoneListitemRender || commentListitemRender) {
		listRender = (
			<List>
				{nameListitemRender}
				{addressListitemRender}
				{phoneListitemRender}
				{commentListitemRender}
			</List>
		);
	}

	return (
		<div>
			<div className="relative grid items-x-center items-y-center">
				<img src={venue.mapUrl} />
				<PlaceIcon className="absolute w-10 h-10 text-zinc-800 drop-shadow" />
			</div>
			{listRender}
		</div>
	);
}
