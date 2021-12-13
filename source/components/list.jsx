import React from 'react';

import Spinner from './spinner.jsx';

import classnames from '../utilities/string/classnames.js';

const colorClasses = {
	sky: 'text-sky-500',
	red: 'text-red-500',
	pink: 'text-pink-500',
	zinc: 'text-zinc-500',
	amber: 'text-amber-500',
	green: 'text-green-500',
	violet: 'text-violet-500',
	fuchsia: 'text-fuchsia-500',
};
export default function List(props, outerRef) {
	let { divider, children } = props;

	let className = classnames('flex flex-col pt-3 pb-3 overflow-y-auto', divider && 'divide-y');

	return <div className={className}>{children}</div>;
}

export function Listitem(props) {
	let { children, ...other } = props;

	return (
		<button
			className="grid grid-flow-col gap-x-4 items-y-center px-4 py-1 min-h-[3rem] flex-shrink-0 text-left focus:outline-none hover:bg-zinc-50 focus-visible:bg-zinc-100 cursor-pointer"
			{...other}
		>
			{children}
		</button>
	);
}

export function ListitemText(props) {
	let { color, align = 'left', emphasize = false, children } = props;

	let className = classnames(
		'truncate',
		emphasize && 'font-bold',
		align === 'left' && 'text-left',
		align === 'center' && 'text-center',
		align === 'right' && 'text-right',
		colorClasses[color],
	);

	return <div className={className}>{children}</div>;
}

export function ListitemSubtext(props) {
	let { color } = props;

	let className = classnames('text-sm truncate', colorClasses[color] ?? 'text-zinc-400');

	return <div className={className}>{props.children}</div>;
}

export function ListitemSpinner() {
	return (
		<div className="w-5 h-5 text-zinc-800">
			<Spinner strokeWidth={2.5} />
		</div>
	);
}
