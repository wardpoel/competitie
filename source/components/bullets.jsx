import React from 'react';

import useValue from '../hooks/use-value.js';

import classnames from '../utilities/string/classnames.js';

export default function Bullets(props) {
	let { length } = props;

	let [value, onChange] = useValue(props);

	let bulletsRender = [];
	for (let index = 0; index < length; ++index) {
		function handleClick(event) {
			return onChange(event, index);
		}

		bulletsRender.push(<Bullet key={index} selected={index === value} onClick={handleClick} />);
	}

	return <div className="flex">{bulletsRender}</div>;
}

function Bullet(props) {
	let { selected, onClick } = props;

	let circleClassName = classnames('w-3 h-3 rounded-full', selected ? 'bg-zinc-500' : 'bg-zinc-300');

	return (
		<button className="grid p-1.5 rounded-full focus:outline-none" tabIndex={-1} onClick={onClick}>
			<span className={circleClassName} />
		</button>
	);
}
