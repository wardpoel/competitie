import React from 'react';
import { useNavigate, useHistory } from 'react-sprout';
import BackButton from '../components/back-button';
import useEventListener from '../hooks/use-event-listener';

export default function ErrorView(props) {
	let { error, onResolve } = props;

	useEventListener(window, 'popstate', onResolve);

	return (
		<div className="grid grid-rows-[auto,minmax(0,1fr)] gap-4 px-4 py-[1.125rem] bg-yellow-300 text-zinc-800 bg-gradient-to-b from-yellow-300 to-yellow-400">
			<div>
				<BackButton />
			</div>
			<div className="grid items-x-center items-y-center">
				<div className="flex flex-col items-center gap-4">
					<div className="text-6xl">🧨</div>
					<div className="text-xl font-semibold">Something went wrong!</div>
					<div className="">{error.message}</div>
				</div>
			</div>
		</div>
	);
}
