type StudentObject = {
  id: number
  first_name: string
  last_name: string
}
export function compareByFirstNameAsc(a: StudentObject, b: StudentObject): number {
  if (a.first_name > b.first_name) return 1
  else if (a.first_name < b.first_name) return -1

  return 0
}

export function compareByFirstNameDesc(a: StudentObject, b: StudentObject): number {
  if (b.first_name > a.first_name) return 1
  else if (b.first_name < a.first_name) return -1

  return 0
}

export function compareByLastNameAsc(a: StudentObject, b: StudentObject): number {
  if (a.last_name > b.last_name) return 1
  else if (a.last_name < b.last_name) return -1

  return 0
}

export function compareByLastNameDesc(a: StudentObject, b: StudentObject): number {
  if (b.last_name > a.last_name) return 1
  else if (b.last_name < a.last_name) return -1

  return 0
}
