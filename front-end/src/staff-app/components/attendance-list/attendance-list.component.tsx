import React, { useEffect, useRef, useState } from "react"
import { Person, PersonHelper } from "shared/models/person"
import styled from "styled-components"
import { HamburgerMenu } from "../hamburger-menu/hamburger-menu.component"

interface Props {
  students: Person[] | undefined
  selectedDate: Date | null
}

type RollCounts = {
  present: number
  late: number
  absent: number
  unmark: number
}

export const AttendanceList: React.FC<Props> = ({ students, selectedDate }) => {
  const [isSideBar, setIsSideBar] = useState<Boolean>(false)
  const [sideBarData, setSideBarData] = useState<Person>()
  const [rollCounts, setRollCounts] = useState<RollCounts>({ present: 0, late: 0, absent: 0, unmark: 0 })

  useEffect(() => {
    if (students !== undefined) {
      var p = 0,
        l = 0,
        a = 0,
        u = 0

      students.map((item) => {
        switch (item.roll_state) {
          case "present":
            p++
            break
          case "late":
            l++
            break
          case "absent":
            a++
            break
          case "unmark":
            u++
            break
        }
      })
      var copy = { ...rollCounts, present: p, late: l, absent: a, unmark: u }
      setRollCounts(copy)
    }
  }, [students])

  const setStudentInSideBarData = (id: number) => {
    var student = students?.filter((el) => el.id == id)
    if (student != undefined && student?.length > 0) setSideBarData(student[0])
  }

  const renderPresentState = () => {
    const list = students?.map((item) => {
      if (item.roll_state === "present") {
        return (
          <A.ListItem
            key={item.id}
            onClick={() => {
              setStudentInSideBarData(item.id)
              setIsSideBar(true)
            }}
          >
            {PersonHelper.getFullName(item)}
          </A.ListItem>
        )
      }
    })
    return list
  }

  const renderLateState = () => {
    const list = students?.map((item) => {
      if (item.roll_state === "late") {
        return (
          <A.ListItem
            key={item.id}
            onClick={() => {
              setStudentInSideBarData(item.id)
              setIsSideBar(true)
            }}
          >
            {PersonHelper.getFullName(item)}
          </A.ListItem>
        )
      }
    })
    return list
  }

  const renderAbsentState = () => {
    const list = students?.map((item) => {
      if (item.roll_state === "absent") {
        return (
          <A.ListItem
            key={item.id}
            onClick={() => {
              setStudentInSideBarData(item.id)
              setIsSideBar(true)
            }}
          >
            {PersonHelper.getFullName(item)}
          </A.ListItem>
        )
      }
    })
    return list
  }

  const renderUnmarkState = () => {
    const list = students?.map((item) => {
      if (item.roll_state === "unmark") {
        return (
          <A.ListItem
            key={item.id}
            onClick={() => {
              setStudentInSideBarData(item.id)
              setIsSideBar(true)
            }}
          >
            {PersonHelper.getFullName(item)}
          </A.ListItem>
        )
      }
    })
    return list
  }

  return (
    <>
      <A.Container>
        <A.Item>
          <RollState.Present>PRESENT</RollState.Present>
          <A.List>{renderPresentState()}</A.List>
          <A.Count>{rollCounts.present}</A.Count>
        </A.Item>
        <A.Item>
          <RollState.Late>LATE</RollState.Late>
          <A.List>{renderLateState()}</A.List>
          <A.Count>{rollCounts.late}</A.Count>
        </A.Item>
        <A.Item>
          <RollState.Absent>ABSENT</RollState.Absent>
          <A.List>{renderAbsentState()}</A.List>
          <A.Count>{rollCounts.absent}</A.Count>
        </A.Item>
        <A.Item>
          <RollState.Unmark>UNMARKED</RollState.Unmark>
          <A.List>{renderUnmarkState()}</A.List>
          <A.Count>{rollCounts.unmark}</A.Count>
        </A.Item>
      </A.Container>
      <HamburgerMenu isOpen={isSideBar} toggleIsOpen={setIsSideBar} data={sideBarData} selDate={selectedDate} />
    </>
  )
}

const A = {
  Container: styled.div`
    display: flex;
    justify-content: center;
    margin: 24px 0;
  `,
  Item: styled.div`
    width: 25%;
    text-align: center;
    background-color: #fff;
    margin: 0 8px;
    padding: 10px 0 30px;
    border-radius: 12px;
    position: relative;
  `,
  List: styled.ul`
    text-align: left;
  `,
  ListItem: styled.li`
    font-size: 16px;
    line-height: 20px;

    &:hover {
      font-weight: 600;
      cursor: pointer;
    }
  `,
  Count: styled.div`
    position: absolute;
    bottom: 10px;
    right: 1rem;
    font-weight: 700;
  `,
}

const RollState = {
  Present: styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #009681;
    background-color: #e0f2f0;
    padding: 10px;
    margin: 0 12px;
    border-radius: 8px;
  `,
  Late: styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #ffc72c;
    background-color: #fff7e1;
    padding: 10px;
    margin: 0 12px;
    border-radius: 8px;
  `,
  Absent: styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #d8232a;
    background-color: #ffebee;
    padding: 10px;
    margin: 0 12px;
    border-radius: 8px;
  `,
  Unmark: styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #303030;
    background-color: #e8e8e8;
    padding: 10px;
    margin: 0 12px;
    border-radius: 8px;
  `,
}
