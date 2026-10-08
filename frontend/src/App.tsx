import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Facilities from "./pages/Facilities";
import Specialists from "./pages/Specialists";
import Appointments from "./pages/Appointments";
import Directions from "./pages/Directions";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/directions" element={<Directions />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;