import React from 'react';
import classnames from '../utilities/string/classnames';

export default function Avatar(props) {
	let { color = false, children } = props;

	let className = classnames(
		'grid w-10 h-10 rounded-full items-x-center items-y-center',
		color === true && 'bg-zinc-600 text-white',
		color === false && 'bg-zinc-100 text-zinc-600',
		color === 'red' && 'bg-red-500 text-white',
		color === 'green' && 'bg-green-500 text-white',
	);

	return <div className={className}>{children}</div>;
}
