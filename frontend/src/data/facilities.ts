export type Facility = {
  name: string;
  type: string;
  distance: string;
  location: string;
  open: string;
  specialties: string;
  emergency: boolean;
  position: [number, number];
};

export const facilities: Facility[] = [
  {
    name: "CarePoint Multispeciality Hospital",
    type: "Hospital",
    distance: "1.8 km",
    location: "Central City",
    open: "Open 24 hours",
    specialties: "General Medicine • Cardiology • Orthopedics",
    position: [10.7905, 78.7047],
    emergency: true,
  },
  {
    name: "HealthFirst Medical Centre",
    type: "Clinic",
    distance: "2.4 km",
    location: "North Avenue",
    open: "Open until 9:00 PM",
    specialties: "General Medicine • Dermatology",
    position: [10.7972, 78.6851],
    emergency: false,
  },
  {
    name: "Wellness Care Hospital",
    type: "Hospital",
    distance: "3.1 km",
    location: "East District",
    open: "Open 24 hours",
    specialties: "Pediatrics • Neurology • General Medicine",
    position: [10.7756, 78.7198],
    emergency: true,
  },
];