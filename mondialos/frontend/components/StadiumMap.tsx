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

const LUSAIL: [number, number] = [25.421, 51.489];

const GATES = [
  { name: "Gate A (North)", pos: [25.4235, 51.489] as [number, number], level: 72 },
  { name: "Gate B (East)", pos: [25.421, 51.4915] as [number, number], level: 38 },
  { name: "Gate C (West)", pos: [25.421, 51.4865] as [number, number], level: 81 },
  { name: "Gate D (South · accessible)", pos: [25.4185, 51.489] as [number, number], level: 25 },
];

function color(l: number) {
  if (l >= 75) return "#ef4444";
  if (l >= 50) return "#f59e0b";
  return "#22c55e";
}

export default function StadiumMap() {
  return (
    <MapContainer center={LUSAIL} zoom={16} style={{ height: "70vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={LUSAIL} icon={icon}>
        <Popup>Lusail Stadium — capacity 88,966</Popup>
      </Marker>
      {GATES.map((g) => (
        <Circle
          key={g.name}
          center={g.pos}
          radius={40}
          pathOptions={{ color: color(g.level), fillColor: color(g.level), fillOpacity: 0.4 }}
        >
          <Popup>
            <b>{g.name}</b>
            <br />
            Congestion: {g.level}% (simulated)
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
