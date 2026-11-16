import { STATUS } from '../data/matching.js';

export default function Badge({ status }) {
  return <span className={'pill ' + status}>{STATUS[status].label}</span>;
}
