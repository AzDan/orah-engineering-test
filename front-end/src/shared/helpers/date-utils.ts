export function getFormattedDate(date: Date | null): string {
  if (date == null || date == undefined) return ""
  else return ("0" + date.getDate()).slice(-2) + "-" + ("0" + date.getMonth()).slice(-2) + "-" + date.getFullYear()
}

export function getFormattedDateReversed(date: Date | null): string {
  if (date == null || date == undefined) return ""
  else return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
}
