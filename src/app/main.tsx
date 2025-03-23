import { createRoot } from 'react-dom/client'
import '@shared/ui/styles/index.css'
import '@app/fonts/inter.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
