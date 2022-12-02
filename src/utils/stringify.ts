import { formatDate } from '@edsolater/fnkit';

export function stringify(value: any): string {
  if (value instanceof Date)
    return formatDate(value, 'YYYY-MM-DD HH:mm:ss');
  return String(value);
}
