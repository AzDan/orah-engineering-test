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

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")
  const [nameSortType, setNameSortType] = useState("first")
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentData, setStudentData] = useState<Person[]>()
  const [constStudentData, setConstStudentData] = useState<Person[]>()
  const [searchString, setSearchString] = useState<string>('')

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
    if(searchString !== '' && searchString.length>0) {
      setStudentData(constStudentData?.filter((student) => PersonHelper.getFullName(student).match(new RegExp(searchString,'gi'))))
    }
    else {
      setStudentData(constStudentData)
    }
  },[searchString])

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

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar 
          onItemClick={onToolbarAction} 
          sortOrder={sortOrder} 
          nameSortType={nameSortType} 
          onNameClick={onSortByNameTypeAction} 
          handleSeach={handleSearch}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
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
      <input 
        type={"text"} 
        placeholder={"Search"}
        onChange={handleSeach} 
        style={inputStyles.inputField} 
      />
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
