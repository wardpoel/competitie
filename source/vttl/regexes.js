const superRegex = /\bSuper\b/i;
const nationalRegex = /\bNationaal\b/i;
const regionalRegex = /\b(RegionIWB|RegionVTTL)\b/i;
const provincialRegex = /\bProv\.\s*([^\s]*)/i;

const cupRegex = /\bBeker\b/i;
const youthRegex = /\bJeugd\b/i;
const womenRegex = /\bDames\b/i;
const veteranRegex = /\bVeteranen\b/i;
const recreantRegex = /\bVrije tijd\b/i;

export { superRegex, nationalRegex, regionalRegex, provincialRegex };
export { cupRegex, youthRegex, womenRegex, veteranRegex, recreantRegex };
