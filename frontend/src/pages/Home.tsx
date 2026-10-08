import {
  Search,
  Stethoscope,
  CalendarDays,
  MapPin,
  ArrowRight,
  MessageCircle,
  Clock,
  ChevronRight,
  Hospital,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const nearbyFacilities = [
  {
    name: "CarePoint Multispeciality Hospital",
    type: "Hospital",
    location: "Central City",
    distance: "1.8 km",
    status: "Open 24 hours",
  },
  {
    name: "HealthFirst Medical Centre",
    type: "Clinic",
    location: "North Avenue",
    distance: "2.4 km",
    status: "Open until 9:00 PM",
  },
  {
    name: "Wellness Care Hospital",
    type: "Hospital",
    location: "East District",
    distance: "3.1 km",
    status: "Open 24 hours",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Header */}

      <section className="home-header">

        <div>
          <p className="eyebrow">
            WELCOME TO CAREPATH
          </p>

          <h1>
            How can I help you today?
          </h1>

          <p className="home-subtitle">
            Find the right healthcare service without the confusion.
          </p>
        </div>

        <button
          className="home-chat-button"
          onClick={() =>
  navigate("/chat", {
    state: {
      startVoice: true,
    },
  })
}
        >
          <MessageCircle size={17} />
          Ask CarePath
        </button>

      </section>


      {/* AI Assistant Hero */}

      <section className="assistant-card">

        <div className="assistant-content">

          <span className="assistant-label">
            ✦ CAREPATH AI
          </span>

          <h2>
            Your healthcare journey starts here.
          </h2>

          <p>
            Talk to CarePath to find healthcare facilities,
            specialists, appointments and directions.
          </p>

          <button
            className="start-button"
            onClick={() => navigate("/chat")}
          >
            Start Talking
            <ArrowRight size={18} />
          </button>

        </div>


        <div className="avatar-placeholder">

          <div className="avatar-orb">

            <div className="avatar-face">
              ✦
            </div>

          </div>

          <strong>
            CarePath
          </strong>

          <span>
            AI Healthcare Assistant
          </span>

          <div className="online-status">

            <span></span>

            Ready to help

          </div>

        </div>

      </section>


      {/* Quick Actions */}

      <section className="quick-section">

        <div className="section-heading">

          <div>

            <h2>
              What do you need?
            </h2>

            <p>
              Choose a quick action or ask CarePath.
            </p>

          </div>

        </div>


        <div className="quick-grid">


          <button
            className="quick-card"
            onClick={() => navigate("/facilities")}
          >

            <div className="quick-icon">
              <Search size={22} />
            </div>

            <div className="quick-card-content">

              <h3>
                Find a Facility
              </h3>

              <p>
                Hospitals, clinics & healthcare centers
              </p>

            </div>

            <ChevronRight
              className="quick-arrow"
              size={18}
            />

          </button>


          <button
            className="quick-card"
            onClick={() => navigate("/specialists")}
          >

            <div className="quick-icon">
              <Stethoscope size={22} />
            </div>

            <div className="quick-card-content">

              <h3>
                Find a Specialist
              </h3>

              <p>
                Find the right healthcare specialty
              </p>

            </div>

            <ChevronRight
              className="quick-arrow"
              size={18}
            />

          </button>


          <button
            className="quick-card"
            onClick={() => navigate("/appointments")}
          >

            <div className="quick-icon">
              <CalendarDays size={22} />
            </div>

            <div className="quick-card-content">

              <h3>
                Book an Appointment
              </h3>

              <p>
                Check availability and request a visit
              </p>

            </div>

            <ChevronRight
              className="quick-arrow"
              size={18}
            />

          </button>


          <button
            className="quick-card"
            onClick={() => navigate("/directions")}
          >

            <div className="quick-icon">
              <MapPin size={22} />
            </div>

            <div className="quick-card-content">

              <h3>
                Get Directions
              </h3>

              <p>
                Find your way to a healthcare facility
              </p>

            </div>

            <ChevronRight
              className="quick-arrow"
              size={18}
            />

          </button>

        </div>

      </section>


      {/* Nearby Facilities */}

      <section className="home-facilities-section">

        <div className="section-heading">

          <div>

            <h2>
              Nearby facilities
            </h2>

            <p>
              Healthcare facilities you can explore.
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/facilities")}
          >
            View all
            <ArrowRight size={15} />
          </button>

        </div>


        <div className="home-facilities-grid">

          {nearbyFacilities.map((facility) => (

            <div
              className="home-facility-card"
              key={facility.name}
            >

              <div className="home-facility-icon">
                <Hospital size={20} />
              </div>

              <div className="home-facility-info">

                <div className="home-facility-top">

                  <span className="home-facility-type">
                    {facility.type}
                  </span>

                  <span className="home-facility-distance">
                    {facility.distance}
                  </span>

                </div>

                <h3>
                  {facility.name}
                </h3>

                <div className="home-facility-location">

                  <MapPin size={13} />

                  {facility.location}

                </div>

                <div className="home-facility-status">

                  <Clock size={13} />

                  {facility.status}

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* CarePath Information */}

      <section className="home-info-banner">

        <div className="home-info-icon">
          ✦
        </div>

        <div>

          <h3>
            Not sure where to start?
          </h3>

          <p>
            Just tell CarePath what you need.
            It can help you find the right healthcare service.
          </p>

        </div>

        <button
          onClick={() => navigate("/chat")}
        >
          Ask CarePath
          <ArrowRight size={16} />
        </button>

      </section>

    </div>
  );
}