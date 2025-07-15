"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

export default function UserCountryMap({ GeoJsonUrl = "/countries.geojson" }) {
  const [geoData, setGeoData] = useState(null);
  const [userData, setUserData] = useState({});

  // mock user
  // const userId = "user001";

  // hook to check userid
  const { user, checking } = useUser();
  useEffect(() => {
    // fetch the logged uer info
    const fetchMapData = async () => {
      try {
        //get geo res
        const geoRes = await fetch(GeoJsonUrl);
        const geoJson = await geoRes.json();
        setGeoData(geoJson);

        // verify the identification, get userid
        if (!user || !user.userId) {
          return;
        }
        const userId = user.userId;

        // fetch highlighted countreis
        const mapRes = await myAxios.get(`/mapdata?userId=${userId}`);
        const mapData = mapRes.data;

        if (mapData?.countryBooks) {
          const map = {};
          mapData.countryBooks.forEach((item) => {
            map[item.country] = item.titles || [];
          });
          setUserData(map);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (!checking) {
      fetchMapData();
    }
  }, [checking, user]);

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

    // console.log("countryName from map:", countryName);
    // console.log("userData:", userData);

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
    <div>
      {!checking && !user && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
          please{" "}
          <a href="/login" className="underline text-blue-500">
            login
          </a>
          , <span>then visit your unique reading map :)</span>
        </div>
      )}
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
    </div>
  );
}
