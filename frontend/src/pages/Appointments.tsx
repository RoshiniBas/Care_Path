import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Hospital,
  CalendarDays,
  Clock,
  UserRound,
  CheckCircle2,
} from "lucide-react";

type Facility = {
  name: string;
  type: string;
  distance: string;
  location: string;
  open: string;
  specialties: string;
  position: [number, number];
};

type Appointment = {
  id: string;
  facility: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  patientName: string;
};

const doctorsBySpecialty: Record<string, string[]> = {
  "General Medicine": [
    "Dr. Ananya Rao",
    "Dr. Karthik Kumar",
  ],

  Cardiology: [
    "Dr. Priya Sharma",
    "Dr. Arjun Mehta",
  ],

  Orthopedics: [
    "Dr. Rahul Menon",
    "Dr. Sneha Iyer",
  ],

  Dermatology: [
    "Dr. Meera Krishnan",
    "Dr. Nithin Raj",
  ],

  Pediatrics: [
    "Dr. Kavya Nair",
    "Dr. Rohan Thomas",
  ],

  Neurology: [
    "Dr. Vivek Shah",
    "Dr. Divya Raman",
  ],
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

   const facility =
    location.state?.facility as Facility | undefined;

 const preselectedSpecialist =
  location.state?.specialist as string | undefined;

  const preselectedSpecialty =
    location.state?.specialty as string | undefined;

  const [selectedSpecialty, setSelectedSpecialty] =
    useState(preselectedSpecialty || "");

  const [selectedDoctor, setSelectedDoctor] =
    useState(preselectedSpecialist || "");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [patientName, setPatientName] =
    useState("");

  /*
   * Load the saved appointment from localStorage.
   */
  const [appointment, setAppointment] =
    useState<Appointment | null>(() => {
      const savedAppointment =
        localStorage.getItem("carepath_appointment");

      if (!savedAppointment) {
        return null;
      }

      try {
        return JSON.parse(savedAppointment);
      } catch {
        return null;
      }
    });

  /*
   * Controls whether we show the confirmation screen.
   *
   * true  = appointment was just requested
   * false = show normal appointments page
   */
  const [showConfirmation, setShowConfirmation] =
    useState(false);

    const [showCancelConfirmation, setShowCancelConfirmation] =
  useState(false);

  const [error, setError] = useState("");

  const availableDoctors =
    selectedSpecialty
      ? doctorsBySpecialty[selectedSpecialty] || []
      : [];

  const handleSubmit = () => {
    setError("");

    if (!selectedSpecialty) {
      setError("Please select a healthcare service.");
      return;
    }

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select a time.");
      return;
    }

    if (!patientName.trim()) {
      setError("Please enter the patient's name.");
      return;
    }

    if (!facility) {
      setError("No healthcare facility was selected.");
      return;
    }

    const newAppointment: Appointment = {
      id: `CP-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`,

      facility: facility.name,

      specialty: selectedSpecialty,

      doctor: selectedDoctor,

      date: selectedDate,

      time: selectedTime,

      patientName: patientName.trim(),
    };

    /*
     * Save appointment locally.
     */
    localStorage.setItem(
      "carepath_appointment",
      JSON.stringify(newAppointment)
    );

    setAppointment(newAppointment);

    /*
     * Show the confirmation screen.
     */
    setShowConfirmation(true);
  };

  const handleCancelAppointment = () => {
    localStorage.removeItem("carepath_appointment");

    setAppointment(null);
    setShowCancelConfirmation(false);
    };

  /*
   * ---------------------------------------------------------
   * CONFIRMATION SCREEN
   * ---------------------------------------------------------
   */

  if (appointment && showConfirmation) {
    return (
      <div className="appointments-page">

        <div className="appointment-confirmation">

          <div className="confirmation-icon">
            <CheckCircle2 size={38} />
          </div>

          <p className="eyebrow">
            APPOINTMENT REQUEST
          </p>

          <h1>Appointment Requested</h1>

          <p className="confirmation-subtitle">
            Your demo appointment request has been created successfully.
          </p>

          <div className="confirmation-card">

            <div className="confirmation-row">
              <Hospital size={20} />

              <div>
                <span>Facility</span>
                <strong>{appointment.facility}</strong>
              </div>
            </div>

            <div className="confirmation-row">
              <UserRound size={20} />

              <div>
                <span>Healthcare service</span>
                <strong>{appointment.specialty}</strong>
              </div>
            </div>

            <div className="confirmation-row">
              <UserRound size={20} />

              <div>
                <span>Doctor</span>
                <strong>{appointment.doctor}</strong>
              </div>
            </div>

            <div className="confirmation-row">
              <CalendarDays size={20} />

              <div>
                <span>Date</span>

                <strong>
                  {new Date(
                    `${appointment.date}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </div>

            <div className="confirmation-row">
              <Clock size={20} />

              <div>
                <span>Time</span>
                <strong>{appointment.time}</strong>
              </div>
            </div>

            <div className="confirmation-id">
              <span>Appointment ID</span>
              <strong>{appointment.id}</strong>
            </div>

          </div>

          <div className="confirmation-actions">

            <button
              className="appointment-submit"
              onClick={() => {
                setShowConfirmation(false);
                navigate("/appointments");
              }}
            >
              View My Appointments
            </button>

             <button
                className="appointment-cancel-button"
                onClick={() => setShowCancelConfirmation(true)}
            >
                Cancel Appointment
            </button>

            <button
              className="confirmation-secondary"
              onClick={() => navigate("/facilities")}
            >
              Find another facility
            </button>

          </div>

          {showCancelConfirmation && (
            <div className="cancel-confirmation">

                <h3>Cancel this appointment?</h3>

                <p>
                This will remove the appointment from your CarePath account.
                </p>

                <div className="cancel-actions">

                <button
                    className="cancel-confirm-button"
                    onClick={handleCancelAppointment}
                >
                    Yes, cancel appointment
                </button>

                <button
                    className="cancel-back-button"
                    onClick={() => setShowCancelConfirmation(false)}
                >
                    Keep appointment
                </button>

                </div>

            </div>
            )}

          <p className="appointment-note">
            This is a demo appointment. No real booking has been made.
          </p>

        </div>

      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * NORMAL APPOINTMENTS PAGE
   * ---------------------------------------------------------
   */

  return (
    <div className="appointments-page">

      <button
        className="back-button"
        onClick={() => navigate("/facilities")}
      >
        <ArrowLeft size={18} />
        Back to facilities
      </button>

      <div className="appointments-header">

        <p className="eyebrow">
          APPOINTMENTS
        </p>

        <h1>
          {appointment
            ? "Upcoming appointment"
            : "Request an appointment"}
        </h1>

        <p>
          {appointment
            ? "View your upcoming healthcare appointment."
            : "Choose your preferred service, doctor, date and time."}
        </p>

      </div>

      {appointment && !facility ? (

        /*
         * ---------------------------------------------------
         * UPCOMING APPOINTMENT
         * ---------------------------------------------------
         */

        <div className="upcoming-appointment-card">

          <div className="upcoming-appointment-header">

            <div>

              <span className="appointment-status">
                CONFIRMED
              </span>

              <h2>
                {appointment.facility}
              </h2>

            </div>

            <div className="appointment-calendar-icon">
              📅
            </div>

          </div>

          <div className="upcoming-appointment-details">

            <div className="upcoming-detail">
              <span>Patient</span>
              <strong>{appointment.patientName}</strong>
            </div>

            <div className="upcoming-detail">
              <span>Healthcare service</span>
              <strong>{appointment.specialty}</strong>
            </div>

            <div className="upcoming-detail">
              <span>Doctor</span>
              <strong>{appointment.doctor}</strong>
            </div>

            <div className="upcoming-detail">
              <span>Date</span>

              <strong>
                {new Date(
                  `${appointment.date}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>

            <div className="upcoming-detail">
              <span>Time</span>
              <strong>{appointment.time}</strong>
            </div>

            <div className="upcoming-detail">
              <span>Facility</span>
              <strong>{appointment.facility}</strong>
            </div>

          </div>

          <div className="upcoming-appointment-id">

            <span>
              Appointment ID
            </span>

            <strong>
              {appointment.id}
            </strong>

          </div>

          <div className="confirmation-actions">

            <button
              className="confirmation-secondary"
              onClick={() => navigate("/facilities")}
            >
              Find another facility
            </button>

          </div>

          <p className="appointment-note">
            This is a demo appointment. No real booking has been made.
          </p>

        </div>

      ) : facility ? (

        /*
         * ---------------------------------------------------
         * REQUEST APPOINTMENT FORM
         * ---------------------------------------------------
         */

        <div className="appointment-layout">

          {/* Selected facility */}

          <div className="appointment-facility-card">

            <div className="appointment-facility-icon">
              <Hospital size={24} />
            </div>

            <div>

              <span className="appointment-label">
                SELECTED FACILITY
              </span>

              <h2>
                {facility.name}
              </h2>

              <p>
                {facility.location}
              </p>

              <span className="appointment-facility-type">
                {facility.type}
              </span>

            </div>

          </div>

          {/* Appointment form */}

          <div className="appointment-form-card">

            <div className="form-section">

              <h2>
                Appointment details
              </h2>

              <p>
                Tell us when you would like to visit.
              </p>

            </div>

            {/* Healthcare service */}

            <div className="form-group">

              <label>
                <UserRound size={15} />
                Healthcare service
              </label>

              <select
                value={selectedSpecialty}
                onChange={(event) => {
                  setSelectedSpecialty(event.target.value);
                  setSelectedDoctor("");
                }}
              >

                <option value="">
                  Select a service
                </option>

                <option>
                  General Medicine
                </option>

                <option>
                  Cardiology
                </option>

                <option>
                  Orthopedics
                </option>

                <option>
                  Dermatology
                </option>

                <option>
                  Pediatrics
                </option>

                <option>
                  Neurology
                </option>

              </select>

            </div>

            {/* Doctor */}

            {selectedSpecialty && (

              <div className="form-group">

                <label>
                  <UserRound size={15} />
                  Choose a doctor
                </label>

                <select
                  value={selectedDoctor}
                  onChange={(event) =>
                    setSelectedDoctor(event.target.value)
                  }
                >

                  <option value="">
                    Select a doctor
                  </option>

                  {availableDoctors.map((doctor) => (

                    <option
                      key={doctor}
                      value={doctor}
                    >
                      {doctor}
                    </option>

                  ))}

                </select>

              </div>

            )}

            {/* Date */}

            <div className="form-group">

              <label>
                <CalendarDays size={15} />
                Preferred date
              </label>

              <input
                type="date"
                value={selectedDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
              />

            </div>

            {/* Time */}

            <div className="form-group">

              <label>
                <Clock size={15} />
                Preferred time
              </label>

              <select
                value={selectedTime}
                onChange={(event) =>
                  setSelectedTime(event.target.value)
                }
              >

                <option value="">
                  Select a time
                </option>

                {timeSlots.map((time) => (

                  <option
                    key={time}
                    value={time}
                  >
                    {time}
                  </option>

                ))}

              </select>

            </div>

            {/* Patient name */}

            <div className="form-group">

              <label>
                Patient name
              </label>

              <input
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(event) =>
                  setPatientName(event.target.value)
                }
              />

            </div>

            {/* Error */}

            {error && (

              <p className="appointment-error">
                {error}
              </p>

            )}

            {/* Submit */}

            <button
              className="appointment-submit"
              onClick={handleSubmit}
            >
              <CheckCircle2 size={18} />
              Request Appointment
            </button>

            <p className="appointment-note">
              This is a demo appointment request.
              No real booking will be made.
            </p>

          </div>

        </div>

      ) : (

        /*
         * ---------------------------------------------------
         * NO APPOINTMENT / NO FACILITY
         * ---------------------------------------------------
         */

        <div className="no-appointment-facility">

          <Hospital size={40} />

          <h2>
            No upcoming appointments
          </h2>

          <p>
            You don't have any upcoming appointments yet.
          </p>

          <button
            onClick={() => navigate("/facilities")}
          >
            Find a facility
          </button>

        </div>

      )}

    </div>
  );
}