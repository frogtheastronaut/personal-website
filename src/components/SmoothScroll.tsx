"use client";

import { useEffect } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function SmoothScroll() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return null;
}
