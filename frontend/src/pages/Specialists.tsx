import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  MapPin,
  CalendarDays,
  X,
  Stethoscope,
} from "lucide-react";

import {
  specialists,
  type Specialist,
} from "../data/specialists";


const specialties = [
  "All",
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Neurology",
];

export default function Specialists() {
  const location = useLocation();

const preselectedSpecialty =
  location.state?.specialty as string | undefined;

  const navigate = useNavigate();

 const [searchQuery, setSearchQuery] = useState("");

const [activeSpecialty, setActiveSpecialty] = useState(
  preselectedSpecialty || "All"
);

const [selectedSpecialist, setSelectedSpecialist] =
 useState<Specialist | null>(null);

  const filteredSpecialists = specialists.filter((specialist) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      specialist.name.toLowerCase().includes(query) ||
      specialist.specialty.toLowerCase().includes(query) ||
      specialist.facility.toLowerCase().includes(query);

    const matchesSpecialty =
      activeSpecialty === "All" ||
      specialist.specialty === activeSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const handleAppointment = (specialist: Specialist) => {
    /*
     * We reuse the appointment flow that we already built.
     *
     * The appointment page expects a facility object.
     */

    const facility = {
      name: specialist.facility,
      type: "Hospital",
      distance: "Nearby",
      location: specialist.location,
      open: "Open 24 hours",
      specialties: specialist.specialty,
      position: [10.7905, 78.7047] as [number, number],
    };

    navigate("/appointments", {
      state: {
        facility,
        specialist: specialist.name,
        specialty: specialist.specialty,
      },
    });
  };

  return (
    <div className="specialists-page">

      {/* Header */}

      <div className="specialists-header">

        <div>

          <p className="eyebrow">
            HEALTHCARE SPECIALISTS
          </p>

          <h1>
            Find a specialist
          </h1>

          <p>
            Find the right healthcare professional for your needs.
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="specialist-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search doctors or specialties..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
        />

      </div>

      {/* Specialty filters */}

      <div className="specialty-filters">

        {specialties.map((specialty) => (

          <button
            key={specialty}
            className={`specialty-filter ${
              activeSpecialty === specialty
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSpecialty(specialty)
            }
          >
            {specialty}
          </button>

        ))}

      </div>

      {/* Results */}

      <div className="specialists-list-header">

        <div>

          <h2>
            Specialists
          </h2>

          <span>
            {filteredSpecialists.length}{" "}
            {filteredSpecialists.length === 1
              ? "specialist"
              : "specialists"}{" "}
            found
          </span>

        </div>

      </div>

      {filteredSpecialists.length > 0 ? (

        <div className="specialists-grid">

          {filteredSpecialists.map((specialist) => (

            <div
              className="specialist-card"
              key={specialist.name}
            >

              {/* Avatar */}

              <div className="specialist-avatar">
                <UserRound size={30} />
              </div>

              {/* Information */}

              <div className="specialist-info">

                <div className="specialist-title-row">

                  <div>

                    <h3>
                      {specialist.name}
                    </h3>

                    <span className="specialist-specialty">
                      {specialist.specialty}
                    </span>

                  </div>

                </div>

                <p className="specialist-experience">
                  {specialist.experience}
                </p>

                <div className="specialist-detail">

                  <MapPin size={15} />

                  <span>
                    {specialist.facility}
                  </span>

                </div>

                <div className="specialist-detail">

                  <CalendarDays size={15} />

                  <span className="specialist-availability">
                    {specialist.availability}
                  </span>

                </div>

                <div className="specialist-actions">

                  <button
                    onClick={() =>
                      setSelectedSpecialist(specialist)
                    }
                  >
                    View Profile
                  </button>

                  <button
                    className="specialist-secondary-action"
                    onClick={() =>
                      handleAppointment(specialist)
                    }
                  >
                    <CalendarDays size={15} />
                    Appointment
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="specialists-no-results">

          <div className="specialists-no-results-icon">
            <Search size={22} />
          </div>

          <h3>
            No specialists found
          </h3>

          <p>
            Try searching for another doctor or specialty.
          </p>

        </div>

      )}

      {/* Specialist profile modal */}

      {selectedSpecialist && (

        <div
          className="specialist-modal-overlay"
          onClick={() =>
            setSelectedSpecialist(null)
          }
        >

          <div
            className="specialist-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="specialist-modal-header">

              <div className="specialist-modal-profile">

                <div className="specialist-modal-avatar">
                  <UserRound size={30} />
                </div>

                <div>

                  <span className="modal-type">
                    {selectedSpecialist.specialty}
                  </span>

                  <h2>
                    {selectedSpecialist.name}
                  </h2>

                </div>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedSpecialist(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="specialist-modal-details">

              <div className="specialist-modal-detail">

                <Stethoscope size={18} />

                <div>

                  <span>Specialty</span>

                  <strong>
                    {selectedSpecialist.specialty}
                  </strong>

                </div>

              </div>

              <div className="specialist-modal-detail">

                <UserRound size={18} />

                <div>

                  <span>Experience</span>

                  <strong>
                    {selectedSpecialist.experience}
                  </strong>

                </div>

              </div>

              <div className="specialist-modal-detail">

                <MapPin size={18} />

                <div>

                  <span>Facility</span>

                  <strong>
                    {selectedSpecialist.facility}
                  </strong>

                </div>

              </div>

              <div className="specialist-modal-detail">

                <CalendarDays size={18} />

                <div>

                  <span>Availability</span>

                  <strong>
                    {selectedSpecialist.availability}
                  </strong>

                </div>

              </div>

            </div>

            <div className="specialist-modal-actions">

              <button
                className="modal-primary"
                onClick={() => {
                  setSelectedSpecialist(null);
                  handleAppointment(selectedSpecialist);
                }}
              >
                <CalendarDays size={16} />
                Request Appointment
              </button>

              <button
                className="modal-secondary"
                onClick={() =>
                  setSelectedSpecialist(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}