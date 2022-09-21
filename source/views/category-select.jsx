import TagIcon from '../components/tag-icon.jsx';

import useValue from '../hooks/use-value.js';

import color from '../vttl/color.js';
import classnames from '../utilities/string/classnames.js';

const classes = {
	sky: 'focus-visible:bg-sky-100 focus-visible:ring-sky-500',
	pink: 'focus-visible:bg-pink-100 focus-visible:ring-pink-500',
	amber: 'focus-visible:bg-amber-100 focus-visible:ring-amber-500',
	green: 'focus-visible:bg-green-100 focus-visible:ring-green-500',
	zinc: 'focus-visible:bg-zinc-100 focus-visible:ring-zinc-500',
	fuchsia: 'focus-visible:bg-fuchsia-100 focus-visible:ring-fuchsia-500',
};

const backgroundClasses = {
	sky: 'bg-sky-100',
	pink: 'bg-pink-100',
	amber: 'bg-amber-100',
	green: 'bg-green-100',
	zinc: 'bg-zinc-100',
	fuchsia: 'bg-fuchsia-100',
};

export default function CategorySelect(props) {
	let { categories = ['men', 'women', 'youth', 'veterans'] } = props;

	let [value, onChange] = useValue(props);

	let iconsRender = categories.map(function (category) {
		let selected = category == value;

		function handleClick(event) {
			onChange?.(event, category);
		}

		let iconColor = color(category);

		let className = classnames(
			'relative grid p-2 rounded-full items-x-center items-y-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
			classes[iconColor],
		);

		let indicatorClassName = classnames(
			'absolute rounded-full inset-0 w-full h-full z-[-1]',
			selected && backgroundClasses[iconColor],
		);

		return (
			<button key={category} className={className} onClick={handleClick}>
				<div className={indicatorClassName} />
				<TagIcon color={iconColor} />
			</button>
		);
	});

	return <div className="flex flex-wrap justify-center gap-2 m-2">{iconsRender}</div>;
}
