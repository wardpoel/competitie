import React from 'react';
import { useRef } from 'react';

import CloseIcon from '../icons/close.jsx';
import SearchIcon from '../icons/search.jsx';
import IconButton from '../components/icon-button.jsx';

import useValue from '../hooks/use-value.js';

export default function SearchInput(props) {
	let inputRef = useRef();
	let [value, onChange] = useValue(props);

	let clearIconRender;
	if (value !== '') {
		function handleClick(event) {
			onChange(event, '');
			inputRef.current.focus();
		}

		clearIconRender = (
			<div className="absolute right-2">
				<IconButton icon={CloseIcon} onClick={handleClick} />
			</div>
		);
	}

	function handleSearchIconClick(event) {
		inputRef.current.select();
	}

	return (
		<div className="relative grid items-y-center">
			<SearchIcon className="absolute left-0 w-6 h-6 m-2.5 text-zinc-800" onClick={handleSearchIconClick} />
			<input
				ref={inputRef}
				className="px-10 py-2 border border-yellow-500 rounded focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-30 focus:border-yellow-500"
				type="text"
				value={value}
				placeholder="Search"
				enterKeyHint="search"
				onChange={onChange}
			/>
			{clearIconRender}
		</div>
	);
}
