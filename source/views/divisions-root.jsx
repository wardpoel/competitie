import { useNavigate } from 'react-sprout';

import List, { Listitem, ListitemText } from '../components/list.jsx';

export default function DivisionsRoot() {
	let navigate = useNavigate();

	function handleSuperClick() {
		navigate('/divisions/super/');
	}

	function handleNationalClick() {
		navigate('/divisions/national/');
	}

	function handleRegionalClick() {
		navigate('/divisions/regional/');
	}

	function handleProvincialClick() {
		navigate('/divisions/provincial/');
	}

	return (
		<List>
			<Listitem onClick={handleSuperClick}>
				<ListitemText>Super</ListitemText>
			</Listitem>
			<Listitem onClick={handleNationalClick}>
				<ListitemText>National</ListitemText>
			</Listitem>
			<Listitem onClick={handleRegionalClick}>
				<ListitemText>Regional</ListitemText>
			</Listitem>
			<Listitem onClick={handleProvincialClick}>
				<ListitemText>Provincial</ListitemText>
			</Listitem>
		</List>
	);
}
