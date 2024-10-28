import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Hero from "./pages/Hero";
import Chat from "./pages/Chat";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
    return (
        // The Switch decides which component to show based on the current URL.
        <div className="flex flex-col min-h-screen bg-lime-50 overscroll-contain">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path={`/`} element={<Hero />} />
                    <Route path={`/chat/`} element={<Chat />} />
                    <Route path={`/*`} element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </div>
    );
}
