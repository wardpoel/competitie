import { StarIcon } from 'material-icons';

import useValue from '../hooks/use-value';

import classnames from '../utilities/string/classnames.js';

export default function FavoriteIcon(props) {
	let { onClick } = props;

	let [value, onChange] = useValue(props);

	function handleClick(event) {
		onClick?.(event);
		onChange?.(event, !value);
	}

	let iconClassName = classnames('w-6 h-6', value ? 'text-yellow-400' : 'text-zinc-400');

	return (
		<div className="relative grid p-1 -m-1 items-x-center items-y-center" onClick={handleClick}>
			<StarIcon className={iconClassName} />
		</div>
	);
}
