import React from 'react';
import { useRef, useState, useMemo, createRef } from 'react';
import { useData } from 'react-sprout';

import Venue from '../../components/venue.jsx';
import Bullets from '../../components/bullets.jsx';

import classnames from '../../utilities/string/classnames.js';
import useEventListener from '../../hooks/use-event-listener.js';

export default function ClubInfo(props) {
	let club = useData();
	let venueCardRefs = useMemo(() => club.venues.map(() => createRef()), [club.venues]);
	let venueCardsContainerRef = useRef();
	let [selectedIndex, setSelectedIndex] = useState(club.venues[0] ? 0 : undefined);

	// Set indicator based on scroll position closest to the corresponding list
	useEventListener(venueCardsContainerRef, 'scroll', { passive: true }, function (event) {
		let selectedIndex;
		let selectedDiff = Infinity;
		let cardsContainer = event.currentTarget;

		let containerX = cardsContainer.offsetWidth / 2;
		for (let index = 0; index < club.venues.length; ++index) {
			let cardElement = venueCardRefs[index]?.current;
			if (cardElement) {
				let cardElementBounds = cardElement.getBoundingClientRect();
				let cardX = cardElementBounds.x + cardElementBounds.width / 2;
				let diff = Math.abs(containerX - cardX);
				if (diff < selectedDiff) {
					selectedDiff = diff;
					selectedIndex = index;
				}
			}
		}

		setSelectedIndex(selectedIndex);
	});

	if (club.venues.length === 0) {
		return <div className="grid p-6 items-x-center items-y-center">No venues found</div>;
	}

	function handleBulletChange(event, index) {
		let cardElement = venueCardRefs[index]?.current;
		if (cardElement) {
			cardElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
		}
	}

	// The minimum distance of the list to the side of the screen
	let elementMargin = club.venues.length > 1 ? 12 : 8;
	// The maximum width of the list
	let maxElementWidth = 96;
	// Calculated styles based on maxElementWidth and elementMargin
	let width = `min(${maxElementWidth / 4}rem, calc(100vw - ${(elementMargin / 4) * 2}rem))`;
	let padding = `calc(50vw - min(${maxElementWidth / 4 / 2}rem, calc(50vw - ${elementMargin / 4}rem)))`;
	let venueCardsRender = club.venues.map(function (venue, index) {
		let className = classnames('py-8', club.venues.length > 1 && 'pb-16');

		return (
			<div ref={venueCardRefs[index]} key={venue.id} className={className}>
				<div className="overflow-hidden bg-white rounded-md shadow snap-center" style={{ width }}>
					<Venue venue={venue} />
				</div>
			</div>
		);
	});

	let bulletsRender;
	if (club.venues.length > 1) {
		bulletsRender = (
			<div className="absolute m-6 self-x-center self-y-end">
				<Bullets length={club.venues.length} value={selectedIndex} onChange={handleBulletChange} />
			</div>
		);
	}

	return (
		<div className="grid bg-white">
			<div ref={venueCardsContainerRef} className="grid overflow-x-auto auto-cols-min snap snap-x snap-mandatory">
				<div
					className="inline-flex items-start justify-center h-full min-w-full gap-8"
					style={{ paddingLeft: padding, paddingRight: padding }}
				>
					{venueCardsRender}
				</div>
			</div>
			{bulletsRender}
		</div>
	);
}
