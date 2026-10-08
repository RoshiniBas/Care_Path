import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Navigation,
} from "lucide-react";
import FacilityMap from "../components/FacilityMap";
import FacilityDetailsModal from "../components/FacilityDetailsModal";
import { facilities } from "../data/facilities";


export default function Facilities() {

  const location = useLocation();

const preselectedType =
  location.state?.type as string | undefined;

const navigate = useNavigate();

  const [selectedFacility, setSelectedFacility] = 
  useState<(typeof facilities)[number] | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

 const [activeFilter, setActiveFilter] = useState(
  preselectedType === "Emergency"
    ? "Emergency"
    : preselectedType || "All"
);
useEffect(() => {
  if (preselectedType === "Emergency") {
    setActiveFilter("Emergency");
  }
}, [preselectedType]);
  const filteredFacilities = facilities.filter((facility) => {
  const query = searchQuery.toLowerCase();

  useEffect(() => {
  if (location.state?.selectedFacility) {
    setSelectedFacility(location.state.selectedFacility);
  }
}, [location.state]);


  const matchesSearch =
    facility.name.toLowerCase().includes(query) ||
    facility.type.toLowerCase().includes(query) ||
    facility.location.toLowerCase().includes(query) ||
    facility.specialties.toLowerCase().includes(query);

  const matchesFilter =
  activeFilter === "All" ||
  (activeFilter === "Emergency"
    ? facility.emergency
    : facility.type === activeFilter);

  return matchesSearch && matchesFilter;
});

  return (
    <div className="facilities-page">

      {/* Header */}
      <div className="facilities-header">
        <div>
          <p className="eyebrow">HEALTHCARE FACILITIES</p>

          <h1>Find a healthcare facility</h1>

          <p>
            Discover hospitals, clinics and healthcare centers near you.
          </p>
        </div>
     </div>

      {/* Search */}
     <div className="facility-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search hospitals, clinics or healthcare services..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="facility-filters">

        <button
          className={`filter-button ${
            activeFilter === "All" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("All")}
        >
          All
        </button>

        <button
          className={`filter-button ${
            activeFilter === "Hospital" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Hospital")}
        >
          Hospitals
        </button>

        <button
          className={`filter-button ${
            activeFilter === "Clinic" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Clinic")}
        >
          Clinics
        </button>

        <button
          className={`filter-button ${
            activeFilter === "Pharmacy" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Pharmacy")}
        >
          Pharmacies
        </button>
<button
  className={`filter-button emergency-filter ${
    activeFilter === "Emergency" ? "active" : ""
  }`}
  onClick={() => setActiveFilter("Emergency")}
>
  Emergency
</button>

      </div>

      {/* Main content */}
      <div className="facility-layout">

        {/* Facility list */}
        <div className="facility-list">

          <div className="facility-list-header">
            <div>
              <h2>Nearby facilities</h2>
              <span>
                {filteredFacilities.length}{" "}
                {filteredFacilities.length === 1 ? "facility" : "facilities"} found
              </span>
            </div>
          </div>

{filteredFacilities.length > 0 ? (
  filteredFacilities.map((facility) => (
    <div className="facility-card" key={facility.name}>

      <div className="facility-icon">
        🏥
      </div>

      <div className="facility-info">

        <div className="facility-title-row">
  <div>
    <h3>{facility.name}</h3>

    <span className="facility-type">
      {facility.type}
    </span>

    {facility.emergency && (
      <span className="emergency-badge">
        Emergency Care
      </span>
    )}
  </div>

  <span className="distance">
    {facility.distance}
  </span>
</div>
        <div className="facility-detail">
          <MapPin size={15} />
          {facility.location}
        </div>

        <div className="facility-detail">
          <Clock size={15} />
          {facility.open}
        </div>

        <p className="facility-specialties">
          {facility.specialties}
        </p>

        <div className="facility-actions">

          <button
            onClick={() => setSelectedFacility(facility)}
          >
            View Details
          </button>

          <button
            className="secondary-action"
            onClick={() =>
              navigate("/directions", {
                state: {
                  facility,
                },
              })
            }
          >
            <Navigation size={15} />
            Directions
          </button>

        </div>

      </div>

    </div>
  ))
) : (
  <div className="no-results">
    <div className="no-results-icon">
      🔍
    </div>

    <h3>No facilities found</h3>

    <p>
      Try a different search or select another category.
    </p>
  </div>
)}

        </div>

                {/* Interactive map */}
        <div className="facility-map">
          <FacilityMap facilities={filteredFacilities} />
        </div>

      </div>

      {selectedFacility && (
        <FacilityDetailsModal
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}

    </div>
    
  );

}