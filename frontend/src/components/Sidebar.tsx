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
  Menu,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Hamburger */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu size={21} />
      </button>

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">✚</div>

        {!collapsed && (
          <div className="logo-text">
            <h2>CarePath</h2>
            <span>AI Healthcare Navigation</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav>

        <NavLink
          to="/"
          title="Home"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Home size={19} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/chat"
          title="Chat"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <MessageCircle size={19} />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/facilities"
          title="Find Facilities"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Hospital size={19} />
          <span>Find Facilities</span>
        </NavLink>

        <NavLink
          to="/specialists"
          title="Specialists"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <UserRound size={19} />
          <span>Specialists</span>
        </NavLink>

        <NavLink
          to="/appointments"
          title="Appointments"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <CalendarDays size={19} />
          <span>Appointments</span>
        </NavLink>

        <NavLink
          to="/saved"
          title="Saved"
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
          title="Emergency"
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

        <button
          className="nav-item"
          title="Settings"
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <button
          className="nav-item"
          title="Help & Support"
        >
          <HelpCircle size={19} />
          <span>Help & Support</span>
        </button>

      </div>

    </aside>
  );
}