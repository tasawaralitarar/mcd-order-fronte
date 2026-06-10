import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// index.htmlのターゲットIDが "root" でも "app" でも両方自動判別するロジック
const rootElement = document.getElementById('root') || document.getElementById('app');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <App />
  )
}