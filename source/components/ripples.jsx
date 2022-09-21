import { useRef, useState } from 'react';

import useRendered from '../hooks/use-rendered.js';
import useEventListener from '../hooks/use-event-listener.js';

export default function Ripples(props) {
	let { disabled, center, color, radius = 50, duration = 750, fade = true, opacity, onRippleEnd } = props;

	let ref = useRef();
	let rippleId = useRef(0);
	let expiredIds = useRef([]);
	let [ripples, setRipples] = useState([]);

	useEventListener(document, 'mousedown', function (event) {
		if (disabled) return;

		let parentNode = ref.current.parentNode;
		if (parentNode.contains(event.target)) {
			let key = rippleId.current++;
			let rect = parentNode.getBoundingClientRect();
			let points = [];
			if (event.touches) {
				for (let i = 0; i < event.touches.length; ++i) {
					points.push(event.touches.item(i));
				}
			} else {
				points.push(event);
			}

			let activeRipples = ripples.filter(ripple => !expiredIds.current.includes(ripple.key));
			let createdRipples = points.map(function (touch) {
				return {
					key,
					x: center == true ? '50%' : touch.clientX - rect.left,
					y: center == true ? '50%' : touch.clientY - rect.top,
					fade,
					color,
					radius,
					opacity,
					duration,
					onComplete: function (event) {
						onRippleEnd?.(event);
						expiredIds.current.push(key);
					},
				};
			});

			expiredIds.current = [];

			setRipples([...activeRipples, ...createdRipples]);
		}
	});

	let ripplesRender = ripples.map(function ({ key, ...rippleProps }) {
		return <Ripple key={key} {...rippleProps} />;
	});

	// w-full and h-full is still needed despite inset-0 because svg?
	return (
		<svg
			ref={ref}
			preserveAspectRatio="none"
			className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
		>
			{ripplesRender}
		</svg>
	);
}

export function Ripple(props) {
	let { x, y, fade = true, color = 'currentColor', radius = 50, duration = 750, opacity, onComplete } = props;

	let ref = useRef();
	let rendered = useRendered();

	let style = {
		fill: color,
		opacity: rendered ? (fade ? 0 : opacity) : opacity,
		transitionProperty: 'opacity, r',
		transitionDuration: duration + 'ms',
		transitionTimingFunction: 'ease-out',
	};

	useEventListener(ref.current, 'transitionend', onComplete);

	return (
		<circle ref={ref} className="z-0 pointer-events-none" cx={x} cy={y} r={rendered ? radius : 0} style={style} />
	);
}
