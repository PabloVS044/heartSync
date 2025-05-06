import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import DiscoverPage from "./pages/DiscoverPage"
import MatchesPage from "./pages/MatchesPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/descubrir" element={<DiscoverPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}
