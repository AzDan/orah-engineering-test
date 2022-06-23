import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { get, LocalStorageKey } from "shared/helpers/local-storage"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { Person } from "shared/models/person"
import { Roll } from "shared/models/roll"
import { getFormattedDateReversed } from "shared/helpers/date-utils"
import { AttendanceList } from "staff-app/components/attendance-list/attendance-list.component"

export const ActivityPage: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  const [studentData, setStudentData] = useState<Person[]>()
  const [hasAttendance, setHasAttendance] = useState<Boolean>(false)
  const [rollData, setRollData] = useState<Roll[]>()
  // const [displayData, setDisplayData] = useState()

  const handleChange = (newValue: Date | null) => {
    setDate(newValue)
  }

  useEffect(() => {
    setRollData(get(LocalStorageKey.rolls))
    setStudentData(get(LocalStorageKey.students))
  }, [])

  useEffect(() => {
    setDataForDisplay()
  }, [rollData, date])

  const setDataForDisplay = () => {
    var copyData = studentData?.map((e) => {
      return { ...e }
    })
    var filteredRollData = rollData?.filter((el) => {
      return el.completed_at.toString().substring(0, 10) == getFormattedDateReversed(date)
    })

    if (filteredRollData != undefined && filteredRollData.length > 0) {
      setHasAttendance(true)
      filteredRollData?.map((el, index) => {
        el.student_roll_states.map((item) => {
          copyData?.map((e) => {
            if (item.student_id == e.id) e.roll_state = item.roll_state
          })
        })
      })
    } else {
      setHasAttendance(false)
    }

    if (copyData !== undefined) setStudentData(copyData)
  }

  return (
    <S.Container>
      <S.DateContainer>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <DesktopDatePicker label="Date" inputFormat="dd/MM/yyyy" value={date} onChange={handleChange} renderInput={(params) => <TextField {...params} />} />
          </Stack>
        </LocalizationProvider>
      </S.DateContainer>
      <S.DisplayContainer>{hasAttendance ? <AttendanceList students={studentData} selectedDate={date} /> : <h1>NO ATTENDANCE FOR THIS DAY</h1>}</S.DisplayContainer>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: ${Spacing.u4} auto 0;
  `,
  DateContainer: styled.div`
    width: 200px;
    margin: 8px auto 0;
  `,
  DisplayContainer: styled.div`
    width: 100%;
    text-align: center;
  `,
}
