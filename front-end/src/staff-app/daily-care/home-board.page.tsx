import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { compareByFirstNameAsc, compareByFirstNameDesc, compareByLastNameAsc, compareByLastNameDesc } from "shared/helpers/student-compare"
import { RollCount, RollInput, RolllStateType } from "shared/models/roll"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")
  const [nameSortType, setNameSortType] = useState("first")
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRoll, rollData, saveRollState] = useApi({ url: "save-roll" })
  const [studentData, setStudentData] = useState<Person[]>()
  const [constStudentData, setConstStudentData] = useState<Person[]>()
  const [rollCount, setRollCount] = useState<RollCount>({ all: 0, present: 0, late: 0, absent: 0 })
  const [searchString, setSearchString] = useState<string>("")

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentData(data?.students)
    setConstStudentData(data?.students)
  }, [data])

  useEffect(() => {
    if (studentData !== undefined) {
      var copyData = [...studentData] //Change reference for re-rendering

      if (sortOrder == "asc") {
        if (nameSortType == "first") {
          const sortedList = copyData.sort(compareByFirstNameAsc)
          setStudentData(sortedList)
        } else {
          const sortedList = copyData.sort(compareByLastNameAsc)
          setStudentData(sortedList)
        }
      } else if (sortOrder == "desc") {
        if (nameSortType == "first") {
          const sortedList = copyData.sort(compareByFirstNameDesc)
          setStudentData(sortedList)
        } else {
          const sortedList = copyData.sort(compareByLastNameDesc)
          setStudentData(sortedList)
        }
      }
    }
  }, [sortOrder, nameSortType])

  useEffect(() => {
    var copyRollCount = { all: 0, present: 0, late: 0, absent: 0 }
    constStudentData?.map((item, index) => {
      switch (item.roll_state) {
        case "present":
          copyRollCount.present++
          break

        case "late":
          copyRollCount.late++
          break

        case "absent":
          copyRollCount.absent++
          break
      }
    })
    if (constStudentData != undefined) {
      copyRollCount.all = constStudentData?.length
      setRollCount(copyRollCount)
    }
  }, [constStudentData])

  useEffect(() => {
    if (searchString !== "" && searchString.length > 0) {
      setStudentData(constStudentData?.filter((student) => PersonHelper.getFullName(student).match(new RegExp(searchString, "gi"))))
    } else {
      setStudentData(constStudentData)
    }
  }, [searchString])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc")
    }
  }

  const onSortByNameTypeAction = () => {
    if (nameSortType === "first") {
      setNameSortType("last")
    } else {
      setNameSortType("first")
    }
  }

  const onActiveRollAction = (action: ActiveRollAction, value?: RolllStateType | "all") => {
    if (action === "exit") {
      setIsRollMode(false)
    }
    if (action === "filter") {
      switch (value) {
        case "all":
          setStudentData(constStudentData)
          break

        case "present":
          setStudentData(
            constStudentData?.filter((item, index) => {
              if (item.roll_state === "present") return item
            })
          )
          break

        case "late":
          setStudentData(
            constStudentData?.filter((item, index) => {
              if (item.roll_state === "late") return item
            })
          )
          break

        case "absent":
          setStudentData(
            constStudentData?.filter((item, index) => {
              if (item.roll_state === "absent") return item
            })
          )
      }
    }
    if (action === "exitsave") {
      setIsRollMode(false)
      const studentRollState: RollInput = { student_roll_states: [] }
      constStudentData?.map((item, index) => {
        var state = { student_id: item.id, roll_state: item.roll_state }
        studentRollState.student_roll_states.push(state)
      })
      saveRoll(studentRollState)
    }
  }

  const updateStudentRollState = (student: Person, newState: RolllStateType) => {
    if (studentData != undefined) {
      var copyData = [...studentData]
      setStudentData(
        copyData.map((item, index) => {
          if (item.id === student.id) return { ...item, roll_state: newState }
          else return item
        })
      )
      setConstStudentData(
        copyData.map((item, index) => {
          if (item.id === student.id) return { ...item, roll_state: newState }
          else return item
        })
      )
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortOrder={sortOrder} nameSortType={nameSortType} onNameClick={onSortByNameTypeAction} handleSeach={handleSearch} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} updateStudentRollState={updateStudentRollState} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} rollcount={rollCount} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortOrder: string
  nameSortType: string
  onNameClick: () => void
  handleSeach: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortOrder, nameSortType, onNameClick, handleSeach } = props
  return (
    <S.ToolbarContainer>
      <S.NameContainer>
        <div>
          <S.Button onClick={() => onNameClick()}>{nameSortType === "first" ? "First" : "Last"} Name</S.Button>
        </div>
        <S.ToggleButton onClick={() => onItemClick("sort")} className={props.sortOrder}>
          <FontAwesomeIcon icon={faAngleDown} style={iconStyles.icon} />
        </S.ToggleButton>
      </S.NameContainer>
      {/* <input type={"text"} placeholder={"Search"} /> */}
      <input type={"text"} placeholder={"Search"} onChange={handleSeach} style={inputStyles.inputField} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const iconStyles = {
  icon: {
    color: "#fff",
  },
}

const inputStyles = {
  inputField: {
    padding: "6px 10px",
  },
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  NameContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  ToggleButton: styled.button`
    width: 1rem;
    height: 1rem;
    margin-left: 0.2rem !important;
    position: relative;
    background-color: ${Colors.blue.base};
    border: none;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${Colors.blue.hover};
    }

    &.desc {
      background-color: ${Colors.blue.hover};

      &:hover {
        background-color: ${Colors.blue.base};
      }

      & .fa-angle-down {
        transform: rotate(180deg);
      }
    }
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
