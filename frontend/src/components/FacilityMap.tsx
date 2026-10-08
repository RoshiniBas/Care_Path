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

export default function FacilityMap({
  facilities,
}: {
  facilities: Facility[];
}) {
  return (
    <MapContainer
      center={[10.7905, 78.7047]}
      zoom={13}
      scrollWheelZoom={true}
      className="facility-leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {facilities.map((facility) => (
        <Marker
          key={facility.name}
          position={facility.position}
          icon={markerIcon}
        >
          <Popup>
            <strong>{facility.name}</strong>

            <br />

            <span>{facility.distance} away</span>

            <br />

            <button>
              View Details
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}