import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import DiscoverPage from "./pages/DiscoverPage"
import MatchesPage from "./pages/MatchesPage"
import MessagesPage from "./pages/MessagesPage"
import ProfileEditPage from "./pages/ProfileEditPage"
import ProfileViewPage from "./pages/ProfileViewPage"
import CompleteProfilePage from "./pages/CompleteProfilePage"
import Chat from "./pages/ChatPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/descubrir" element={<DiscoverPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/mensajes" element={<MessagesPage />} />
        <Route path="/mensajes/:id" element={<Chat />} />
        <Route path="/editar-perfil" element={<ProfileEditPage />} />
        <Route path="/perfil" element={<ProfileViewPage />} />
        <Route path="/complete-profile/:id" element={<CompleteProfilePage/>}></Route>

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}
