"use client";

import { useEffect, useState } from "react";

export type ActiveTheme = "light" | "dark";

export function readActiveTheme(): ActiveTheme {
  if (typeof document === "undefined") return "light"; // light is the default theme
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** Reactively tracks the active colour theme (the data-theme attribute on <html>). */
export function useActiveTheme(): ActiveTheme {
  const [theme, setTheme] = useState<ActiveTheme>("light");

  useEffect(() => {
    const update = () => setTheme(readActiveTheme());
    update();

    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => mo.disconnect();
  }, []);

  return theme;
}
