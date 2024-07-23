"use client";
import { api } from "@/trpc/react";
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
import { Loading } from "./loading";
import SelectOrientation from "./select-orientation";
export default function SelectImplentation() {
  const [implentation] = api.henallux.getImplentations.useSuspenseQuery();
  const [selectedImplentation, setSelectedImplentation] = React.useState<
    null | number
  >(null);
  return (
    <>
      <Select
        onValueChange={(e) => {
          setSelectedImplentation(parseInt(e));
        }}
      >
        <SelectTrigger className="max-w-[500px]">
          <SelectValue placeholder="Choisir son implentation" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Implentations</SelectLabel>
            {implentation?.map((i) => (
              <SelectItem key={i.key} value={i.key.toString()}>
                {i.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Suspense fallback={<Loading size={20} />}>
        {selectedImplentation ? (
          <SelectOrientation implentation_id={selectedImplentation} />
        ) : null}
      </Suspense>
    </>
  );
}

export const SelectImplentationLoading = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"animate-spin"}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
