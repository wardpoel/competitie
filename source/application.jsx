import React from 'react';
import Router from './router.jsx';

import Suspense from './views/suspense.jsx';

export default function Application() {
	return (
		<Suspense>
			<div className="w-full h-full grid grid-columns-[100%] grid-rows-[100%]">
				<Router />
			</div>
		</Suspense>
	);
}
