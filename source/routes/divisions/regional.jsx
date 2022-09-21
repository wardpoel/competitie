import { useHistory } from 'react-sprout';

import List, { Listitem, ListitemText } from '../../components/list.jsx';
import BackButton from '../../components/back-button.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

export default function Regional() {
	let history = useHistory();

	function handleFlandersClick() {
		history.navigate('/divisions/regional/flanders/');
	}

	function handleWalloniaClick() {
		history.navigate('/divisions/regional/wallonia/');
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="flex gap-4">
					<BackButton />
					<ApplicationBarTitle>Regional</ApplicationBarTitle>
				</div>
			</ApplicationBar>
			<List>
				<Listitem onClick={handleFlandersClick}>
					<ListitemText>Flanders</ListitemText>
				</Listitem>

				<Listitem onClick={handleWalloniaClick}>
					<ListitemText>Wallonia</ListitemText>
				</Listitem>
			</List>
		</div>
	);
}
