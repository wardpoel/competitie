import React from 'react';

import { DateTime } from 'luxon';

import score from '../vttl/score';
import ScoreBadge from './score-badge';

export default function MatchBadge(props) {
	let { match, home, away } = props;

	if (match.score) {
		return <ScoreBadge score={score(match.score)} home={home} away={away} />;
	} else if (match.id == undefined && match.date) {
		return <div className="px-3 py-1 text-zinc-400">{DateTime.fromISO(match.date).toFormat('dd-LL-yyyy')}</div>;
	}
}
