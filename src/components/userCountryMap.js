"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { books } from "@/data/sampleData";

export default function UserCountryMap({ GeoJsonUrl = "/countries.geojson" }) {
  const [geoData, setGeoData] = useState(null);
  const [userData, setUserData] = useState({});
  // mock user
  // TODO change logic
  const userId = "user001";

  useEffect(() => {
    fetch(GeoJsonUrl)
      .then((res) => res.json())
      .then(setGeoData)
      .catch(console.error);

    fetch(`/api/mapdata?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.countryBooks) {
          const map = {};
          data.countryBooks.forEach((item) => {
            map[item.country] = item.titles || [];
          });
          setUserData(map);
        }
      });
  }, []);

  // modify the color

  const getColour = (count) => {
    if (!count) return "#eee";
    const base = 255 - Math.min(count * 20, 200);
    return `rgb(255, ${base}, 0)`;
  };

  const onEachFeature = (fea, layer) => {
    const countryName = fea.properties.name;
    const titles = userData[countryName] || [];
    const len = titles.length;
    const isActive = len > 0;
    const fillColor = getColour(len);

    console.log("countryName from map:", countryName);
    console.log("userData:", userData);

    layer.setStyle({
      fillColor,
      fillOpacity: 0.7,
      weight: 1,
      color: "#999",
    });

    if (!isActive) {
      layer.on("click", () => {
        alert(`You haven't bought books from ${countryName} yet.\nGo explore?`);
      });
    } else {
      const uniqueTitles = [...new Set(titles)];
      const bookTitles = [uniqueTitles].join("\n");
      layer.bindTooltip(`${countryName}\nYou bought:\n${bookTitles}`, {
        sticky: true,
        direction: "top",
        className: "leaflet-tooltip-multiline",
      });
    }
  };
  if (!geoData) return <div>loading</div>;
  return (
    <MapContainer
      style={{ height: "600px", width: "100%" }}
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
      ></TileLayer>
      <GeoJSON data={geoData} onEachFeature={onEachFeature}></GeoJSON>
    </MapContainer>
  );
}
