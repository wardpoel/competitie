import React from 'react';

import { LocalOfferIcon } from 'material-icons';

import classnames from '../utilities/string/classnames.js';

const colorClasses = {
	sky: 'text-sky-400',
	red: 'text-red-400',
	teal: 'text-teal-400',
	pink: 'text-pink-400',
	zinc: 'text-zinc-400',
	amber: 'text-amber-400',
	green: 'text-green-400',
	violet: 'text-violet-400',
	fuchsia: 'text-fuchsia-400',
};

export default function TagIcon(props) {
	let { color } = props;

	let className = classnames('w-6 h-6', colorClasses[color] ?? 'text-zinc-200');

	return <LocalOfferIcon className={className} />;
}
