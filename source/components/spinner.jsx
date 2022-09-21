import React from 'react';

export default function Spinner(props) {
	let { length = 0.6, strokeWidth = 3 } = props;

	let radius = 0.5;
	let angle = 2 * Math.PI * length;
	let sweep = length >= 0.5 ? 1 : 0;
	let minSize = strokeWidth * 4;

	let startX = 0;
	let startY = -radius;
	let finishX = Math.sin(angle) * radius;
	let finishY = -Math.cos(angle) * radius;

	let style = {
		padding: Math.ceil(strokeWidth / 2),
		minWidth: minSize,
		minHeight: minSize,
	};

	return (
		<div className="w-full h-full" style={style}>
			<svg
				className="overflow-visible"
				viewBox="-0.5 -0.5 1 1"
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				preserveAspectRatio="xMidYMid meet"
			>
				<circle className="opacity-25" cx="0" cy="0" r={radius} vectorEffect="non-scaling-stroke" />
				<path
					className="animate-spin"
					vectorEffect="non-scaling-stroke"
					d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${sweep} 1 ${finishX} ${finishY}`}
				/>
			</svg>
		</div>
	);
}
