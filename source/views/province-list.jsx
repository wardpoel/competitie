import List, { Listitem, ListitemText, ListitemSpinner } from '../components/list';

import provinces from '../vttl/provinces.js';

export default function ProvinceList(props) {
	let { pending, selected, onSelect } = props;

	let provincesRender = provinces.map(function (province) {
		function handleClick(event) {
			onSelect?.(event, province);
		}

		let listitemSpinnerRender;
		if (pending && province === selected) {
			listitemSpinnerRender = <ListitemSpinner />;
		}

		return (
			<Listitem key={province.id} role="link" onClick={handleClick}>
				<div className="flex items-center justify-between gap-4">
					<ListitemText>{province.name}</ListitemText>
					{listitemSpinnerRender}
				</div>
			</Listitem>
		);
	});

	return <List>{provincesRender}</List>;
}
