import React from 'react';
import Spinner from '../components/spinner.jsx';

export default function SpinnerView() {
	return (
		<div className="grid w-full h-full items-x-center items-y-center">
			<div className="w-6 h-6 max-w-full max-h-full text-zinc-800">
				<Spinner />
			</div>
		</div>
	);
}
