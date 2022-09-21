import { useMemo, useContext, createContext } from 'react';

import Ripples from './ripples.jsx';

import useValue from '../hooks/use-value.js';
import classnames from '../utilities/string/classnames.js';

let navigationBarContext = createContext({ value: undefined, onChange: undefined });

export default function NavigationBar(props) {
	let { children } = props;

	let [value, onChange] = useValue(props);

	let navigationBarContextValue = useMemo(() => {
		return { value, onChange };
	}, [value, onChange]);

	return (
		<div className="flex justify-center bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-outer pb-0-safe">
			<div className="grid grid-flow-col auto-cols-[minmax(5rem,7.5rem)] max-w-lg">
				<navigationBarContext.Provider value={navigationBarContextValue}>
					{children}
				</navigationBarContext.Provider>
			</div>
		</div>
	);
}

export function NavigationBarItem(props) {
	let { value, icon: Icon, label, onClick, onSelect } = props;

	let { value: navigationBarValue, onChange } = useContext(navigationBarContext);
	let selected = navigationBarValue === value;

	function handleClick(event) {
		onClick?.(event);

		if (selected === false) {
			onSelect?.(event, value);
			onChange?.(event, value);
		}
	}

	let className = classnames(
		'relative flex flex-col items-center px-4 py-3 gap-1 focus:outline-none overflow-hidden focus-visible:bg-white/10',
		selected ? 'text-yellow-300' : 'text-zinc-300 focus-visible:text-zinc-300',
	);

	return (
		<button className={className} onClick={handleClick}>
			<Ripples />
			<Icon className="w-6 h-6" />
			<span className="text-xs">{label}</span>
		</button>
	);
}
