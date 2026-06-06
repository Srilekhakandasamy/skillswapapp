import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Skills from "./pages/Skills";
import Bookings from "./pages/Bookings";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* SIGNUP */}
        <Route path="/signup" element={<Signup />} />

        {/* SKILLS */}
        <Route path="/skills" element={<Skills />} />

        {/* BOOKINGS */}
        <Route path="/bookings" element={<Bookings />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* REVIEWS */}
        <Route path="/reviews" element={<Reviews />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;