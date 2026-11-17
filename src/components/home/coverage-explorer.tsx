"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import {
  MAP_SIZE,
  projectCity,
  UkCoverageMap,
} from "@/components/home/uk-coverage-map";
import type { City } from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * City pills and the dotted UK map, linked both ways: hovering a pill
 * grows its pin and shows the city name on the map; hovering a pin
 * highlights its pill.
 */
export function CoverageExplorer({
  heading,
  cities,
}: {
  heading: React.ReactNode;
  cities: City[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeCity = cities.find((c) => c.name === active);
  const tip = activeCity ? projectCity(activeCity) : null;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        {heading}
        <ul className="flex flex-wrap gap-2" aria-label="Featured cities">
          {cities.map((city) => (
            <li
              key={city.name}
              data-city={city.name}
              onMouseEnter={() => setActive(city.name)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-300",
                active === city.name
                  ? "border-gold text-gold"
                  : "border-paper/15 text-paper",
              )}
            >
              <MapPin className="size-3.5 text-gold" aria-hidden="true" />
              {city.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
        <UkCoverageMap cities={cities} active={active} onActive={setActive} />
        {activeCity && tip && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[170%] rounded-full border border-gold bg-ink px-3 py-1 text-xs whitespace-nowrap text-paper shadow-lg"
            style={{
              left: `${(tip.x / MAP_SIZE.width) * 100}%`,
              top: `${(tip.y / MAP_SIZE.height) * 100}%`,
            }}
          >
            {activeCity.name}
          </span>
        )}
      </div>
    </div>
  );
}
