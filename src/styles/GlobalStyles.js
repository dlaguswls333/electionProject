import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  :root {
    color: #0f172a;
    background: #f7f8fb;
    font-family:
      'IBM Plex Sans KR', Pretendard, Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-synthesis: none;
    line-height: 1.5;
    text-rendering: geometricPrecision;
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: #111827;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background: #111827;
  }

  #root {
    min-height: 100vh;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  button {
    border: 0;
  }
`

export default GlobalStyles
