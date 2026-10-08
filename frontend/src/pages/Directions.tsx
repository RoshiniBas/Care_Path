import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type Facility = {
  name: string;
  type: string;
  distance: string;
  location: string;
  open: string;
  specialties: string;
  position: [number, number];
};

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Directions() {
  const location = useLocation();
  const navigate = useNavigate();

  const facility = location.state?.facility as Facility | undefined;

  return (
    <div className="directions-page">

      <button
        className="back-button"
        onClick={() => navigate("/facilities")}
      >
        <ArrowLeft size={18} />
        Back to facilities
      </button>

      <div className="directions-header">
        <p className="eyebrow">NAVIGATION</p>

        <h1>Get directions</h1>

        <p>
          Find your way to the selected healthcare facility.
        </p>
      </div>

      {facility ? (
        <div className="directions-layout">

          {/* Destination information */}
          <div className="destination-card">

            <div className="destination-icon">
              <MapPin size={24} />
            </div>

            <div>
              <span className="destination-label">
                DESTINATION
              </span>

              <h2>{facility.name}</h2>

              <p>{facility.location}</p>

              <span className="destination-distance">
                {facility.distance} away
              </span>
            </div>

          </div>

          {/* Real map */}
          <div className="directions-map">

            <MapContainer
              center={facility.position}
              zoom={15}
              scrollWheelZoom={true}
              className="directions-leaflet-map"
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={facility.position}
                icon={markerIcon}
              >
                <Popup>
                  <strong>{facility.name}</strong>

                  <br />

                  <span>
                    {facility.distance} away
                  </span>
                </Popup>
              </Marker>

            </MapContainer>

          </div>

        </div>
      ) : (
        <div className="no-destination">

          <MapPin size={40} />

          <h2>No destination selected</h2>

          <p>
            Select a healthcare facility first to get directions.
          </p>

          <button onClick={() => navigate("/facilities")}>
            <Navigation size={16} />
            Find a facility
          </button>

        </div>
      )}

    </div>
  );
}