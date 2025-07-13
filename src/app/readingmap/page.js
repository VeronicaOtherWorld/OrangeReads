"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const UserCountryMap = dynamic(() => import("@/components/userCountryMap"), {
  ssr: false,
  loading: () => <div className="text-center">Loading map...</div>,
});

export default function ReadingMapPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Reading Map</h1>
        <Suspense fallback={<div>Loading map...</div>}>
          {/* fetch local geojson data */}
          <UserCountryMap geoJsonUrl="/countries.geojson" />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
