"use client";
import React, { Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import DisplayToDaySchedule from "./display-today-schedule";
import { Loading } from "./loading";
export default function SelectLocal({
  implentation_id,
}: {
  implentation_id: number;
}) {
  const [locaux] = api.henallux.getLocaux.useSuspenseQuery(implentation_id);
  const [selectedLocal, setSelectedLocal] = React.useState<null | number>(null);
  return (
    <>
      <Select
        onValueChange={(e) => {
          setSelectedLocal(parseInt(e));
        }}
      >
        <SelectTrigger className="max-w-[500px]">
          <SelectValue placeholder="Choisir le local" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Locaux</SelectLabel>
            {locaux?.map((i) => (
              <SelectItem key={i.key} value={i.key.toString()}>
                {i.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedLocal ? (
        <Suspense fallback={<Loading size={20} />}>
          <DisplayToDaySchedule local_id={selectedLocal} />
        </Suspense>
      ) : null}
    </>
  );
}
