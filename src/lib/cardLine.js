/* The short line under each recipe card that says what is missing.
   It uses the same items as the "To buy" list on the recipe page. */
import { labelFor } from './labels.js';

const SHOW = 3;
const nameOf = (i) => labelFor(i.key).toLowerCase();

/* Lists names, up to 3 in total across both parts, then "+N more". */
function names(items, room) {
  return items.slice(0, room).map(nameOf).join(', ');
}

export function missingLine(match) {
  const total = match.missing.length;
  if (total === 0) {
    const n = match.core.length;
    return n === 1 ? '1 needed ingredient at home' : 'All ' + n + ' needed ingredients at home';
  }
  const more = total > SHOW ? ' +' + (total - SHOW) + ' more' : '';

  if (match.status === 'almost') return 'Buy ' + total + ' more: ' + names(match.missing, SHOW) + more;

  const main = match.missingEssential;
  if (main.length) {
    let line = 'Missing main: ' + names(main, SHOW);
    const room = SHOW - Math.min(main.length, SHOW);
    if (room > 0 && match.missingRequired.length) line += ' · Also: ' + names(match.missingRequired, room);
    return line + more;
  }
  return 'Need ' + total + ' more: ' + names(match.missing, SHOW) + more;
}
