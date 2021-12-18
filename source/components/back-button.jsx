import React from 'react';

import IconButton from './icon-button.jsx';
import ArrowBackIcon from '../icons/arrow-back.jsx';

export default function BackButton(props) {
	let { onClick } = props;

	function handleClick(event) {
		onClick?.(event);
		if (event.defaultPrevented == false) {
			history.back();
		}
	}

	return <IconButton icon={ArrowBackIcon} ripples={false} onClick={handleClick} />;
}
