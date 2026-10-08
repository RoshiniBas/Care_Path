import { useEffect, useState } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  ArrowUp,
  CalendarDays,
  Hospital,
  MapPin,
  MessageCircle,
  Mic,
  Search,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import CarePathVoice from "../components/CarePathVoice";
import { useLanguage } from "../context/LanguageContext";


type Message = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    if (location.state?.startVoice) {
      // Voice session should start here
      console.log("Starting CarePath voice session...");
    }
  }, [location.state]);

  const [input, setInput] = useState("");

  const [toolResult, setToolResult] = useState<any>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

const [actionContext, setActionContext] = useState<
  | "default"
  | "dermatology"
  | "cardiology"
  | "orthopedics"
  | "pediatrics"
  | "neurology"
  | "hospital"
  | "clinic"
  | "appointment"
  | "emergency"
>("default");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hi! I'm CarePath. I can help you find healthcare facilities, specialists, appointments and directions. What can I help you with today?",
    },
  ]);

  const sendMessage = async (messageText?: string) => {
  const text = (messageText ?? input).trim();

  if (!text || isLoading) return;

  setActionContext("default");

  setToolResult(null);

  setActiveTool(null);

  const userMessage: Message = {
    id: Date.now(),
    sender: "user",
    text,
  };

  setMessages((current) => [...current, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        language: language,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from CarePath backend.");
    }

const data = await response.json();

const tool = data.tool;
setActiveTool(tool);
const toolArguments = data.tool_arguments;

setToolResult(data.tool_result);

if (tool === "find_specialists") {
  const specialty = toolArguments?.specialty;

  if (specialty === "Dermatology") {
    setActionContext("dermatology");
  } else if (specialty === "Cardiology") {
    setActionContext("cardiology");
  } else if (specialty === "Orthopedics") {
    setActionContext("orthopedics");
  } else if (specialty === "Pediatrics") {
    setActionContext("pediatrics");
  } else if (specialty === "Neurology") {
    setActionContext("neurology");
  } else {
    setActionContext("default");
  }

} else if (tool === "find_facilities") {
  const facilityType = toolArguments?.facility_type;

  if (facilityType === "Hospital") {
    setActionContext("hospital");
  } else if (facilityType === "Clinic") {
    setActionContext("clinic");
  } else if (facilityType === "Emergency") {
    setActionContext("emergency");
  } else {
    setActionContext("default");
  }

} else if (tool === "find_emergency_facility") {
  setActionContext("emergency");

} else if (tool === "check_availability") {
  setActionContext("appointment");

} else {
  setActionContext("default");
}

    const assistantMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      text: data.response,
    };

    setMessages((current) => [...current, assistantMessage]);
  } catch (error) {
    console.error(error);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      text: "I'm having trouble connecting to CarePath right now. Please try again in a moment.",
    };

    setMessages((current) => [...current, assistantMessage]);
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat-page">

       <CarePathVoice
      autoStart={location.state?.startVoice === true}
    />

      {/* HEADER */}

      <div className="chat-header">
        <div className="chat-header-left">

          <div className="chat-ai-icon">
            ✦
          </div>

          <div>
            <h1>CarePath AI</h1>

            <div className="chat-online">
              <span></span>
              Online
            </div>
          </div>
          <LanguageSwitcher />

        </div>

        <div className="chat-header-label">
          Healthcare Navigation Assistant
        </div>
      </div>


      {/* CHAT CONTENT */}

      <div className="chat-content">

        {messages.length === 1 && (
          <div className="chat-welcome">

            <div className="welcome-avatar">
              ✦
            </div>

            <p className="welcome-label">
              CAREPATH AI
            </p>

            <h2>
              How can I help you today?
            </h2>

            <p className="welcome-description">
              I can help you navigate healthcare services,
              find specialists, explore facilities and request appointments.
            </p>

            <div className="chat-quick-actions">

              <button
                onClick={() =>
                  sendMessage("Find a healthcare facility")
                }
              >
                <Search size={17} />
                Find a facility
              </button>

              <button
                onClick={() =>
                  sendMessage("Find a specialist")
                }
              >
                <Stethoscope size={17} />
                Find a specialist
              </button>

              <button
                onClick={() =>
                  sendMessage("I want to book an appointment")
                }
              >
                <CalendarDays size={17} />
                Book appointment
              </button>

              <button
                className="emergency-action"
                onClick={() =>
                  sendMessage("I need emergency help")
                }
              >
                <ShieldAlert size={17} />
                Emergency help
              </button>

            </div>

          </div>
        )}


        {/* MESSAGES */}

        <div className="chat-messages">

          {messages.map((message) => (

            <div
              key={message.id}
              className={`chat-message-row ${
                message.sender === "user"
                  ? "user-row"
                  : "assistant-row"
              }`}
            >

              {message.sender === "assistant" && (
                <div className="message-avatar">
                  ✦
                </div>
              )}

              <div
                className={`chat-message ${
                  message.sender === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                <span
                dangerouslySetInnerHTML={{
                  __html: message.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br />"),
                }}
              />
              </div>

              {message.sender === "user" && (
                <div className="message-user-avatar">
                  <UserRound size={16} />
                </div>
              )}

            </div>

          ))}

        </div>

        {/* FACILITY RESULTS */}

{toolResult &&
  (activeTool === "find_facilities" ||
    activeTool === "find_emergency_facility") &&
  Array.isArray(toolResult) && (
    <div className="chat-facility-results">
      {toolResult.map((facility: any) => (
        <div
          className="chat-facility-card"
          key={facility.name}
        >
    <div>
      <strong>{facility.name}</strong>

      <small>{facility.location}</small>

      {facility.address && (
        <small>📍 {facility.address}</small>
      )}

      {facility.phone && (
        <a
          href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
          className="chat-phone-link"
        >
          📞 {facility.phone}
        </a>
      )}

      {facility.open && (
        <small>{facility.open}</small>
      )}

      {facility.emergency && (
        <span className="chat-emergency-badge">
          Emergency Care
        </span>
      )}
    </div>

          <div className="chat-facility-actions">
            <button
              onClick={() =>
                navigate("/facilities", {
                  state: {
                    selectedFacility: facility,
                  },
                })
              }
            >
              View Details
            </button>

            <button
              onClick={() =>
                navigate("/directions", {
                  state: {
                    facility,
                  },
                })
              }
            >
              <MapPin size={15} />
              Directions
            </button>
          </div>
        </div>
      ))}
    </div>
  )}


        {/* ACTION CARDS */}

        {messages.length > 1 && (
  <div className="chat-navigation-actions">
{actionContext === "emergency" ? (
  <button
    className="emergency-navigation-action"
    onClick={() => navigate("/facilities")}
  >
    <ShieldAlert size={18} />

    <span>
      <strong>Find emergency care</strong>
      <small>Find a nearby healthcare facility</small>
    </span>
  </button>
) : actionContext === "dermatology" ? (
  <button
    onClick={() =>
      navigate("/specialists", {
        state: {
          specialty: "Dermatology",
        },
      })
    }
  >
    <Stethoscope size={18} />

    <span>
      <strong>View dermatologists</strong>
      <small>Browse dermatology specialists</small>
    </span>
  </button>
) : actionContext === "cardiology" ? (
  <button
    onClick={() =>
      navigate("/specialists", {
        state: {
          specialty: "Cardiology",
        },
      })
    }
  >
    <Stethoscope size={18} />

    <span>
      <strong>View cardiologists</strong>
      <small>Browse cardiology specialists</small>
    </span>
  </button>
) : actionContext === "orthopedics" ? (
  <button
    onClick={() =>
      navigate("/specialists", {
        state: {
          specialty: "Orthopedics",
        },
      })
    }
  >
    <Stethoscope size={18} />

    <span>
      <strong>View orthopedic specialists</strong>
      <small>Browse orthopedic specialists</small>
    </span>
  </button>
) : actionContext === "pediatrics" ? (
  <button
    onClick={() =>
      navigate("/specialists", {
        state: {
          specialty: "Pediatrics",
        },
      })
    }
  >
    <Stethoscope size={18} />

    <span>
      <strong>View pediatric specialists</strong>
      <small>Browse pediatric specialists</small>
    </span>
  </button>
) : actionContext === "neurology" ? (
  <button
    onClick={() =>
      navigate("/specialists", {
        state: {
          specialty: "Neurology",
        },
      })
    }
  >
    <Stethoscope size={18} />

    <span>
      <strong>View neurologists</strong>
      <small>Browse neurology specialists</small>
    </span>
  </button>
) : actionContext === "hospital" ? (
  <button
    onClick={() =>
      navigate("/facilities", {
        state: {
          type: "Hospital",
        },
      })
    }
  >
    <Hospital size={18} />

    <span>
      <strong>Find hospitals</strong>
      <small>Browse nearby hospitals</small>
    </span>
  </button>
) : actionContext === "clinic" ? (
  <button
    onClick={() =>
      navigate("/facilities", {
        state: {
          type: "Clinic",
        },
      })
    }
  >
    <Hospital size={18} />

    <span>
      <strong>Find clinics</strong>
      <small>Browse nearby clinics</small>
    </span>
  </button>
) : actionContext === "appointment" ? (
  <button
    onClick={() => navigate("/appointments")}
  >
    <CalendarDays size={18} />

    <span>
      <strong>Book an appointment</strong>
      <small>Choose a specialty and doctor</small>
    </span>
  </button>
) : (
  
      <>
        <button
  onClick={() =>
    navigate("/facilities", {
      state: {
        type: "Hospital",
      },
    })
  }
>
  <Hospital size={18} />

  <span>
    <strong>Find hospitals</strong>
    <small>Browse nearby hospitals</small>
  </span>
</button>

        <button onClick={() => navigate("/specialists")}>
          <Stethoscope size={18} />

          <span>
            <strong>Find a specialist</strong>
            <small>Browse healthcare specialties</small>
          </span>
        </button>

        <button onClick={() => navigate("/appointments")}>
          <CalendarDays size={18} />

          <span>
            <strong>Book appointment</strong>
            <small>Request a healthcare visit</small>
          </span>
        </button>

        <button onClick={() => navigate("/directions")}>
          <MapPin size={18} />

          <span>
            <strong>Get directions</strong>
            <small>Navigate to a facility</small>
          </span>
        </button>
      </>
    )}
  </div>
)}
      </div>


      {/* INPUT */}

      <div className="chat-input-area">

        <form
          className="chat-input-box"
          onSubmit={handleSubmit}
        >

          <MessageCircle
            size={19}
            className="chat-input-icon"
          />

          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Tell CarePath what you need..."
            aria-label="Message CarePath"
          />

          <button
            type="button"
            className="voice-button"
            title="Voice input coming soon"
          >
            <Mic size={19} />
          </button>

          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <ArrowUp size={19} />
          </button>

        </form>

        <p className="chat-disclaimer">
          CarePath provides healthcare navigation assistance,
          not medical diagnosis or treatment.
        </p>

      </div>

    </div>
  );
}