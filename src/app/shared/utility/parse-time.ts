export function parse12hTime(value: string): [number, number] {
  const [timePart, period] = value.split(' ');
  let [h, m] = timePart.split(':').map(v => parseInt(v, 10));

  // Преобразуем в 24-часовой формат
  if (period === 'PM' && h < 12) {
    h += 12;
  }
  if (period === 'AM' && h === 12) {
    h = 0;
  }

  return [h, m];
}
