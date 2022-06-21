import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { get, LocalStorageKey } from "shared/helpers/local-storage"

export const ActivityPage: React.FC = () => {
  useEffect(() => {
    console.log(get(LocalStorageKey.rolls))
    console.log(get(LocalStorageKey.students))
  })
  return <S.Container>Activity Page</S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
