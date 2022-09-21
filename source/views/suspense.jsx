import { Suspense as ReactSuspense } from 'react';

import Spinner from './spinner.jsx';

export default function Suspense(props) {
	let fallbackRender = <Spinner />;

	return <ReactSuspense fallback={fallbackRender}>{props.children}</ReactSuspense>;
}
