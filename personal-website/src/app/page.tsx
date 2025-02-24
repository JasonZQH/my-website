"use client";
import React, { Suspense } from "react";
import HomePage from "./home_page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
