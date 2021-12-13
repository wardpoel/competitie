import React from 'react';

import { Fragment } from 'react';
import { usePlayer } from '../player';

import classnames from '../../utilities/string/classnames';

export default function PlayerResults() {
	let player = usePlayer();

	return (
		<div className="w-full h-full grid grid-rows-[1fr,auto,auto] p-4 gap-4">
			<div>
				<Results results={player.results} ranking={player.ranking} />
			</div>
			<div className="grid items-x-center text-zinc-300">#{player.id}</div>
			<div className="grid grid-flow-col gap-4 auto-cols-fr">
				<Badge title="Elo" value={player.elo} />
				<Badge title="Points" value={player.points} />
				<Badge title="Position" value={player.position} />
			</div>
		</div>
	);
}

function Badge(props) {
	let { title, value } = props;

	return (
		<div className="flex flex-col items-center p-2 rounded bg-zinc-100">
			<div>{title}</div>
			<div className="text-zinc-500">{value}</div>
		</div>
	);
}

function Results(props) {
	let { results } = props;

	if (results.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No results found</div>;
	}

	let max = 0;
	let positive = {};
	let negative = {};

	for (let entry of results) {
		let ranking = entry.player.ranking;

		if (positive[ranking] == undefined) positive[ranking] = 0;
		if (negative[ranking] == undefined) negative[ranking] = 0;

		if (entry.result === 'V') {
			positive[ranking] += 1;
		} else if (entry.result === 'D') {
			negative[ranking] += 1;
		}
	}

	for (let ranking in positive) {
		max = Math.max(max, positive[ranking] + negative[ranking]);
	}

	let rankings = Object.keys(positive).sort();
	let rankingsRender = rankings.map(function (ranking) {
		let won = positive[ranking];
		let lost = negative[ranking];
		let total = won + lost;

		return (
			<Fragment key={ranking}>
				<div className="text-sm text-right text-zinc-500">{lost}</div>
				<Progress result="D" value={lost} number={total} total={max} />
				<div>{ranking}</div>
				<Progress result="V" value={won} number={total} total={max} />
				<div className="text-sm text-left text-zinc-500">{won}</div>
			</Fragment>
		);
	});

	return (
		<div className="grid grid-cols-[1fr,10fr,auto,10fr,1fr] items-y-center gap-x-4 gap-y-2">{rankingsRender}</div>
	);
}

function Progress(props) {
	let { result, value, number, total } = props;

	let className = classnames(
		'grid h-2 rounded-full',
		result === 'D' && 'items-x-end',
		result === 'V' && 'items-x-start',
	);

	let valueWidth = `${(value / total) * 100}%`;
	let totalWidth = `${(number / total) * 100}%`;

	let progressRender;
	if (value > 0) {
		if (result === 'D') {
			progressRender = (
				<div className="col-[1] row-[1] rounded-full bg-red-500 min-w-[0.5rem]" style={{ width: valueWidth }} />
			);
		}
		if (result === 'V') {
			progressRender = (
				<div
					className="col-[1] row-[1] rounded-full bg-green-500 min-w-[0.5rem]"
					style={{ width: valueWidth }}
				/>
			);
		}
	}

	return (
		<div className={className}>
			<div
				className="col-[1] row-[1] rounded-full bg-zinc-100 min-w-[0.5rem]"
				style={{ width: totalWidth }}
			></div>
			{progressRender}
		</div>
	);
}
