import styled from 'styled-components/macro'
import Box from '@mui/material/Box'

export default {
  DevicesPanel: styled(Box)`
  
`,
  EmptyWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    &>div {
    margin: 24px;
    }
    &>span {
    font-size: 16px;
    font-weight: 200;
    margin-bottom: 24px;
}
`,
}
