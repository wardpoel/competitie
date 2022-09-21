import TagIcon from './tag-icon.jsx';

import color from '../vttl/color.js';

export default function DivisionIcon(props) {
	let { division } = props;

	return <TagIcon color={color(division.name)} />;
}
