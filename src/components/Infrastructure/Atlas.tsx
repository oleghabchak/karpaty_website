"use client";

import Link from "next/link";
import { useState } from "react";
import { atlasRoutes, places, type PlaceId } from "@/data/infrastructureData";

const placeById = new Map(places.map((place) => [place.id, place]));

/* The map box is 4:3, so the SVG uses a 100×75 viewBox and y is scaled to fit */
const Y_SCALE = 0.75;

function routePath(stops: PlaceId[]) {
  return stops
    .map((id, index) => {
      const { x, y } = placeById.get(id)!.atlas;
      return `${index === 0 ? "M" : "L"} ${x} ${y * Y_SCALE}`;
    })
    .join(" ");
}

/* Decorative topographic rings, in the same 0–100 space as atlas coordinates */
const contours = [
  { cx: 30, cy: 40, rx: [10, 18, 26, 34, 42], ry: [7, 13, 19, 25, 31], rotate: -12 },
  { cx: 76, cy: 58, rx: [8, 15, 22, 29], ry: [6, 11, 17, 23], rotate: 18 },
];

const Atlas = () => {
  const [activeId, setActiveId] = useState(atlasRoutes[0].id);
  const route = atlasRoutes.find((item) => item.id === activeId)!;
  const stopIndex = new Map(route.stops.map((id, index) => [id, index]));

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Атлас клубу
        </p>
        <h2 className="mb-12 max-w-2xl text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
          Оберіть маршрут — і подивіться, як місця працюють разом.
        </h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Маршрути">
              {atlasRoutes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === activeId}
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold duration-300 ${
                    item.id === activeId
                      ? "border-primary bg-primary text-white"
                      : "border-body-color/20 text-black hover:border-primary hover:text-primary dark:border-white/20 dark:text-white"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div aria-live="polite">
              <p className="mb-3 text-xl font-bold text-black dark:text-white">{route.lead}</p>
              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                {route.description}
              </p>
              <ol className="mb-8 space-y-3">
                {route.stops.map((id, index) => (
                  <li key={id} className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold tabular-nums text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {placeById.get(id)!.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <Link href={route.href} className="text-sm font-semibold text-primary hover:underline">
              {route.linkLabel} →
            </Link>
          </div>

          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-light text-primary dark:bg-bg-color-dark"
            aria-hidden
          >
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
              <g transform={`scale(1 ${Y_SCALE})`}>
                {contours.map((ring) =>
                  ring.rx.map((rx, index) => (
                    <ellipse
                      key={`${ring.cx}-${rx}`}
                      cx={ring.cx}
                      cy={ring.cy}
                      rx={rx}
                      ry={ring.ry[index]}
                      transform={`rotate(${ring.rotate} ${ring.cx} ${ring.cy})`}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity={0.18}
                      vectorEffect="non-scaling-stroke"
                    />
                  )),
                )}
              </g>
              <path
                key={route.id}
                d={routePath(route.stops)}
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={1}
                className="motion-safe:animate-route-draw"
              />
            </svg>

            {places.map((place) => {
              const index = stopIndex.get(place.id);
              const onRoute = index !== undefined;
              return (
                <div
                  key={place.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${place.atlas.x}%`, top: `${place.atlas.y}%` }}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums duration-300 ${
                      onRoute
                        ? "scale-100 bg-primary text-white shadow-two"
                        : "scale-75 bg-white text-body-color dark:bg-gray-dark dark:text-body-color-dark"
                    }`}
                  >
                    {onRoute ? index + 1 : ""}
                  </span>
                  <span
                    className={`absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap text-xs font-semibold sm:block ${
                      onRoute ? "text-black dark:text-white" : "text-body-color/70 dark:text-body-color-dark/70"
                    }`}
                  >
                    {place.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atlas;
