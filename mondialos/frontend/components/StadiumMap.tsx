"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons in bundlers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Real FIFA World Cup 2026 venues (USA / Mexico / Canada)
const VENUES: { name: string; city: string; pos: [number, number]; level: number }[] = [
  { name: "MetLife Stadium (Final)", city: "East Rutherford, NJ", pos: [40.8135, -74.0745], level: 81 },
  { name: "AT&T Stadium (9 matches)", city: "Arlington, TX", pos: [32.7473, -97.0945], level: 72 },
  { name: "Estadio Azteca (Opening)", city: "Mexico City", pos: [19.3029, -99.1505], level: 65 },
  { name: "SoFi Stadium", city: "Inglewood, CA", pos: [33.9535, -118.3393], level: 48 },
  { name: "BC Place", city: "Vancouver, BC", pos: [49.2768, -123.1119], level: 30 },
  { name: "BMO Field", city: "Toronto, ON", pos: [43.6325, -79.4185], level: 25 },
];

function color(l: number) {
  if (l >= 75) return "#ef4444";
  if (l >= 50) return "#f59e0b";
  return "#22c55e";
}

export default function StadiumMap() {
  return (
    <MapContainer center={[37, -95]} zoom={4} style={{ height: "70vh", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {VENUES.map((v) => (
        <div key={v.name}>
          <Marker position={v.pos} icon={icon}>
            <Popup>
              <b>{v.name}</b>
              <br />
              {v.city}
            </Popup>
          </Marker>
          <Circle
            center={v.pos}
            radius={6000}
            pathOptions={{ color: color(v.level), fillColor: color(v.level), fillOpacity: 0.35 }}
          >
            <Popup>
              <b>{v.name}</b>
              <br />
              {v.city}
              <br />
              Pressure: {v.level}% (simulated)
            </Popup>
          </Circle>
        </div>
      ))}
    </MapContainer>
  );
}
