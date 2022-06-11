type StudentObject = {
  id: number
  first_name: string
  last_name: string
}
export function compareByFirstName(a: StudentObject, b: StudentObject): number {
  if (a.first_name > b.first_name) return 1
  else if (a.first_name < b.first_name) return -1

  return 0
}

export function compareByLastName(a: StudentObject, b: StudentObject): number {
  if (a.last_name > b.last_name) return 1
  else if (a.last_name < b.last_name) return -1

  return 0
}
