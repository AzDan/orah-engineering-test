import { getRandomInt, generateRange } from "shared/helpers/math-utils"
import { compareByFirstName } from "./student-compare"

const nameTokens = ["Alan", "John", "Brandon", "Key", "Branda", "Morris", "Carlos", "Lee"]

export function generateStudent(id: number) {
  return {
    id,
    first_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
    last_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
  }
}

export function generateStudents(number: number) {
  return generateRange(number)
    .map((_, id) => generateStudent(id + 1))
    .sort(compareByFirstName)
}
