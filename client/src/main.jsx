import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-oldschool-dark'

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AlertProvider template={AlertTemplate}{...options}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </AlertProvider>
)
