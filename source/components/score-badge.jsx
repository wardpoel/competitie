import React from 'react';

import classnames from '../utilities/string/classnames';

const colorClasses = {
	defeat: 'text-white bg-red-500',
	neutral: 'text-white bg-zinc-500',
	victory: 'text-white bg-green-500',
	default: 'text-zinc-600 bg-zinc-100',
};

const sizeClasses = {
	normal: 'text-base',
	small: 'text-xs',
};

export default function ScoreBadge(props) {
	let { score, home, away, size = 'normal' } = props;

	let [homeScore, awayScore] = score;

	let state;
	if (home && away) {
		state = 'neutral';
	} else if (home || away) {
		if (homeScore == awayScore) {
			state = 'neutral';
		} else {
			state = (home && homeScore > awayScore) || (away && awayScore > homeScore) ? 'victory' : 'defeat';
		}
	} else {
		state = 'default';
	}

	let className = classnames('px-3 py-1  rounded-full whitespace-nowrap', colorClasses[state], sizeClasses[size]);

	return (
		<div className={className}>
			{homeScore} - {awayScore}
		</div>
	);
}
