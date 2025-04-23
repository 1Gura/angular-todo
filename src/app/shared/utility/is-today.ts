export const isToday = (expIso: string): boolean => {
  return expIso.slice(0,10) === new Date().toISOString().slice(0,10);
}
