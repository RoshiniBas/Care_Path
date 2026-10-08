import { X, MapPin, Clock, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";


type Facility = {
  name: string;
  type: string;
  distance: string;
  location: string;
  open: string;
  specialties: string;
   address?: string;
  phone?: string;
};

type FacilityDetailsModalProps = {
  facility: Facility;
  onClose: () => void;
};

export default function FacilityDetailsModal({
  facility,
  onClose,
}: FacilityDetailsModalProps) {
    const navigate = useNavigate();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="facility-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-type">{facility.type}</span>
            <h2>{facility.name}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="modal-details">

          <div className="modal-detail">
            <MapPin size={18} />
            <div>
              <span>Location</span>
              <strong>{facility.location}</strong>
            </div>
          </div>

          {facility.address && (
  <div className="modal-detail">
    <MapPin size={18} />
    <div>
      <span>Address</span>
      <strong>{facility.address}</strong>
    </div>
  </div>
)}

{facility.phone && (
  <div className="modal-detail">
    <span>📞</span>
    <div>
      <span>Phone</span>
      <a
        href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
        className="modal-phone"
      >
        {facility.phone}
      </a>
    </div>
  </div>
)}

          <div className="modal-detail">
            <Clock size={18} />
            <div>
              <span>Opening hours</span>
              <strong>{facility.open}</strong>
            </div>
          </div>

          <div className="modal-detail">
            <Navigation size={18} />
            <div>
              <span>Distance</span>
              <strong>{facility.distance}</strong>
            </div>
          </div>

        </div>

        {/* Specialties */}
        <div className="modal-section">
          <h3>Available services</h3>
          <p>{facility.specialties}</p>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="modal-primary"
            onClick={() => {
                onClose();

                navigate("/appointments", {
                state: { facility },
                });
            }}
            >
            Request Appointment
            </button>

          <button className="modal-secondary">
            <Navigation size={16} />
            Get Directions
          </button>
        </div>

      </div>
    </div>
  );

  
}

