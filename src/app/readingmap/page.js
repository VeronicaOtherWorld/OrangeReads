"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReadingMap from "@/components/map";
export default function ReadingMapPage() {
  return (
    <div className="min-h-screen">
      <Header />
      this is reading map page
      {/* map */}
      <ReadingMap />
      <Footer />
    </div>
  );
}
