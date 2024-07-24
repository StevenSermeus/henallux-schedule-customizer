"use client";
import { api } from "@/trpc/react";
import React from "react";

export default function DisplayToDaySchedule({
  local_id,
}: {
  local_id: number;
}) {
  const [schedule] = api.henallux.isLocalFree.useSuspenseQuery({
    local_id,
  });
  return (
    <div>
      <p className="text-center text-lg font-bold">Liste des occupations</p>
      {schedule.length === 0
        ? "Le local est dispo toute la journée "
        : schedule.map(
            (s, i) =>
              s.start &&
              s.end && (
                <div key={i}>
                  {/* 15:00:00 remove the seconde */}
                  {new Date(s.start)
                    .toLocaleTimeString("fr-FR", {})
                    .slice(0, -3)}{" "}
                  -{" "}
                  {new Date(s.end).toLocaleTimeString("fr-FR", {}).slice(0, -3)}{" "}
                  - {s.title}
                </div>
              ),
          )}
    </div>
  );
}
