import React from "react"
import { Person, PersonHelper } from "shared/models/person"
import styled from "styled-components"

interface Props {
  student: Person
}
export const AttendanceListTile: React.FC<Props> = ({ student }) => {
  const renderRollState = () => {
    switch (student.roll_state) {
      case "present":
        return <RollState.Present>PRESENT</RollState.Present>
      case "late":
        return <RollState.Late>LATE</RollState.Late>
      case "absent":
        return <RollState.Absent>ABSENT</RollState.Absent>
      case "unmark":
        return <RollState.Unmark>UNMARKED</RollState.Unmark>
    }
  }
  return (
    <>
      <div>{PersonHelper.getFullName(student)}</div>
      {renderRollState()}
    </>
  )
}

const RollState = {
  Present: styled.div`
    color: green;
  `,
  Late: styled.div`
    color: yellow;
  `,
  Absent: styled.div`
    color: gray;
  `,
  Unmark: styled.div`
    color: black;
  `,
}
