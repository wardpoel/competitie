import Ripples from './ripples';

import classnames from '../utilities/string/classnames';

export default function IconButton(props) {
	let { type = 'button', shade = 'dark', icon: Icon, ripples = true, disable, disabled, children, ...other } = props;

	let className = classnames(
		'relative grid p-1 -m-1 items-x-center items-y-center focus:outline-none group',
		shade === 'dark' && 'text-zinc-800',
		shade === 'light' && 'text-zinc-200',
	);
	let iconClassName = classnames('w-6 h-6', disable && 'opacity-50');
	let indicatorClassName = classnames(
		'absolute w-8 h-8 -m-1 rounded-full pointer-events-none group-focus-visible:scale-100 scale-0 transition-transform',
		shade === 'dark' && 'bg-zinc-800/10 ',
		shade === 'light' && 'bg-zinc-200/10',
	);

	let ripplesRender;
	if (ripples) {
		ripplesRender = <Ripples center={true} radius="24" disabled={disabled} />;
	}

	return (
		<button className={className} type={type} disabled={disabled} {...other}>
			<Icon className={iconClassName} />
			<div className={indicatorClassName} />
			{ripplesRender}
		</button>
	);
}
