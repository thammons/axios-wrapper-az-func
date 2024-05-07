export function getLocalDateFromUtcString(dateString: string) {
  const utcDateTimeString = dateString; //'2024-04-06T06:25:02.538Z';
  const utcDate = new Date(utcDateTimeString);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
  );
  return localDate;
}
