export default function resultDescription(result) {
	return result.type === 'T' ? result.tournament.name : result.player.club;
}
