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
import React, { Suspense } from "react";
import SelectYear from "./select-year";
import { Loading } from "./loading";

export default function SelectOrientation({
  implentation_id,
}: {
  implentation_id: number;
}) {
  const [orientation] = api.henallux.getOrientations.useSuspenseQuery({
    implentation_id,
  });
  const [selectedOrientation, setSelectedOrientation] = React.useState<
    null | number
  >(null);

  return (
    <>
      <Select
        onValueChange={(e) => {
          setSelectedOrientation(parseInt(e));
        }}
      >
        <SelectTrigger className="max-w-[500px]">
          <SelectValue placeholder="Choisir son orientation" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Orientation</SelectLabel>
            {orientation?.map((i) => (
              <SelectItem key={i.key} value={i.key.toString()}>
                {i.intitule_paysage}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedOrientation ? (
        <Suspense fallback={<Loading size={30} />}>
          <SelectYear
            orientation_id={selectedOrientation}
            implentation_id={implentation_id}
          />
        </Suspense>
      ) : null}
    </>
  );
}
