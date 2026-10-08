import {
  Home,
  MessageCircle,
  Hospital,
  UserRound,
  CalendarDays,
  Bookmark,
  Settings,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import {useNavigate} from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">✚</div>

        <div>
          <h2>CarePath</h2>
          <span>AI Healthcare Navigation</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Home size={19} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <MessageCircle size={19} />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/facilities"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Hospital size={19} />
          <span>Find Facilities</span>
        </NavLink>

        <NavLink
          to="/specialists"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <UserRound size={19} />
          <span>Specialists</span>
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <CalendarDays size={19} />
          <span>Appointments</span>
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Bookmark size={19} />
          <span>Saved</span>
        </NavLink>

      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">

        <button
          className="nav-item"
          onClick={() =>
            navigate("/facilities", {
              state: {
                type: "Emergency",
              },
            })
          }
        >
          <AlertTriangle size={19} />
          <span>Emergency</span>
        </button>

        <button className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <button className="nav-item">
          <HelpCircle size={19} />
          <span>Help & Support</span>
        </button>

      </div>

    </aside>
  );
}