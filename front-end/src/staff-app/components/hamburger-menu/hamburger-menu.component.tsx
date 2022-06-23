import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Dispatch, SetStateAction, useState, useEffect } from "react"
import Calendar from "calendar-reactjs"
import { Person, PersonHelper } from "shared/models/person"
import { get, LocalStorageKey } from "shared/helpers/local-storage"
import styled from "styled-components"
import { Roll } from "shared/models/roll"
import { getFormattedDateReversed } from "shared/helpers/date-utils"

interface Props {
  isOpen: Boolean
  toggleIsOpen: Dispatch<SetStateAction<Boolean>>
  data: Person | undefined
  selDate: Date | null
}

type CalDays = {
  date: string
  status: string
}

export const HamburgerMenu: React.FC<Props> = ({ isOpen, toggleIsOpen, data, selDate }) => {
  const [rollData, setRollData] = useState<Roll[]>()
  const [calendarDays, setCalendarDays] = useState<CalDays[]>()

  useEffect(() => {
    setRollData(get(LocalStorageKey.rolls))
  }, [])

  useEffect(() => {
    var calDays: CalDays[] = []

    rollData?.map((item) => {
      var completedAtString = item.completed_at.toString().substring(0, 10)
      var studState = item.student_roll_states.filter((el) => {
        return el.student_id == data?.id
      })
      if (studState !== undefined && studState.length > 0) {
        calDays.push({ date: completedAtString, status: studState[0].roll_state.substring(0, 1).toUpperCase() })
      }
    })
    if (calendarDays !== undefined) {
      var update = calendarDays?.map((item, index) => {
        return { ...item, date: calDays[index].date, status: calDays[index].status }
      })
      setCalendarDays(update)
    } else {
      setCalendarDays(calDays)
    }
  }, [rollData, data])

  return (
    <Menu isOpen={isOpen}>
      <M.Container>
        <M.Cross onClick={() => toggleIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </M.Cross>
        <div style={{ display: "flex", alignItems: "center" }}>
          <M.UserIcon>
            <FontAwesomeIcon icon={faUser} size="2x" />
          </M.UserIcon>
          <div>
            <Student.Name>{data && PersonHelper.getFullName(data)}</Student.Name>
            <Student.ID>ID - {data && data.id}</Student.ID>
            <Student.RollState>
              Roll State - <span className={`${data?.roll_state}`}>{data && data.roll_state.toUpperCase()}</span>
            </Student.RollState>
          </div>
        </div>
        <M.Calendar>
          <Calendar
            month={{
              date: getFormattedDateReversed(selDate),
              days: calendarDays,
            }}
            emptyCellStyle={{ backgroundColor: "white" }}
            status={{
              P: {
                labelStyle: { backgroundColor: "#e0f2f0", color: "#009681", borderRadius: "8px", padding: "0px 0px 3px 0px", fontWeight: "600" },
              },
              A: {
                labelStyle: { backgroundColor: "#ffebee", color: "#d8232a", borderRadius: "8px", padding: "0px 0px 3px 0px", fontWeight: "600" },
              },
              L: {
                labelStyle: { backgroundColor: "#fff7e1", color: "#ffc72c", borderRadius: "8px", padding: "0px 0px 3px 0px", fontWeight: "600" },
              },
              U: {
                labelStyle: { backgroundColor: "#e8e8e8", color: "#303030", borderRadius: "8px", padding: "0px 0px 3px 0px", fontWeight: "600" },
              },
            }}
          />
        </M.Calendar>
      </M.Container>
    </Menu>
  )
}

const M = {
  Cross: styled.span`
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    width: 1.2rem;
    height: 1.6rem;

    &:hover {
      cursor: pointer;
    }
  `,
  UserIcon: styled.div`
    background-color: #e8e8e8;
    padding: 18px;
    border-radius: 50%;
    margin-right: 20px;
  `,
  Container: styled.div`
    padding: 3rem 2rem;
  `,
  Calendar: styled.div`
    margin-top: 12px;
    & .tablediv {
      & table {
        & td.day-cell {
          height: 12px;
          min-width: unset;

          & > div {
            height: auto;
            padding: 4px;
            width: 30px;

            & > div {
              height: 24px;
            }
          }
        }
      }
    }
  `,
}

const Student = {
  Name: styled.div`
    font-size: 22px;
    font-weight: 600;
    padding-bottom: 8px;
  `,
  ID: styled.div`
    font-size: 16px;
  `,
  RollState: styled.div`
    font-size: 16px;
    & span {
      &.present {
        color: #009681;
      }
      &.late {
        color: #ffc72c;
      }
      &.absent {
        color: #d8232a;
      }
      &.unmark {
        color: #303030;
      }
    }
  `,
}

const Menu = styled.div<Pick<Props, "isOpen">>`
  width: 30%;
  height: 100%;
  text-align: left;
  position: absolute;
  top: 0;
  right: ${(p) => (p.isOpen ? "0" : "-35%")};
  background-color: #fff;
  border-radius: 12px 0 0 12px;
  transition: all 0.4s linear;
`
