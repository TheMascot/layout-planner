import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {BrowserRouter, Route, Routes} from 'react-router'
import App from './App.tsx';
import {LoadLayoutPage} from './pages/LoadLayoutPage.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/load-layout" element={<LoadLayoutPage/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
