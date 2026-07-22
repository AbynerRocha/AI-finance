import ReactDOM from 'react-dom/client'
import App from './App'
import dayjs from 'dayjs'
import localeBR from 'dayjs/locale/pt-br.js'

const rootElement = document.getElementById('app')!

dayjs.locale(localeBR)

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
