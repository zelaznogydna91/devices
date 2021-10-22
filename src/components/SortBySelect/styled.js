import styled, { css } from 'styled-components/macro'
import {
  ToggleButton,
  IconButton,
} from '@mui/material'
import { Colors } from 'common/theme'

const sortAttribute = css`
  width: 16px;
  height: 16px;
  position: absolute;
  border-radius: 10px;
  background: ${Colors.primary};
  color: ${Colors.lightText};
  text-align: center;
  display: flex;
  align-items: center;
  `

export default {
  SortBySelect: styled.div`
`,
  IconButton: styled(IconButton)`
    &>svg {
      width: .75em;  
      height: .75em;  
    }
  `,
  ToggleButton: styled(ToggleButton)`
    &>#sort-direction {
      ${sortAttribute}
      padding-top: 10px;
      padding-left: 1px;
      bottom: 4px;
      right: 4px;
      font-size: 24px;
    }
    &>#sort-order {
      ${sortAttribute}
      top: 1px;
      left:1px;
      justify-content: center;
      line-height: 12;
      font-size: 12px;
    }


    

  /* && {
    &.MuiSvgIcon-root::after {
      content: 'abc-xxx';
      width: 10px;
      height: 10px;
      background: red;
    }
  } */
`,
}
