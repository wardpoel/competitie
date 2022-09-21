export default function ApplicationBar(props) {
	return (
		<div className="z-30 grid grid-cols-1 gap-4 p-4 min-h-[1.75rem] bg-yellow-300 shadow text-zinc-800 bg-gradient-to-b from-yellow-300 to-yellow-400">
			{props.children}
		</div>
	);
}

export function ApplicationBarTitle(props) {
	return <div className="text-xl font-medium truncate">{props.children}</div>;
}
