import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { api } from "@/trpc/react";
import React, { Suspense, useEffect } from "react";
import SelectClasses from "./select-classes";
import { Loading } from "./loading";

export default function SelectYear({
  orientation_id,
  implentation_id,
}: {
  orientation_id: number;
  implentation_id: number;
}) {
  const [year] = api.henallux.getYear.useSuspenseQuery({
    orientation_id,
    implentation_id,
  });
  const options = year.map((option) => {
    return {
      name: option.name,
      value: option.key.toString(),
    };
  });
  const [value, setValue] = React.useState<string[]>([]);
  useEffect(() => {
    console.log("reset year");
    setValue([]);
  }, [orientation_id, implentation_id]);
  return (
    <>
      <MultiSelector
        values={value}
        onValuesChange={setValue}
        loop={false}
        className="max-w-[500px]"
      >
        <MultiSelectorTrigger>
          <MultiSelectorInput placeholder="Année" />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {options.map((option, i) => (
              <MultiSelectorItem key={i} value={option.name}>
                {option.name}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
      {value.length > 0 ? (
        <Suspense fallback={<Loading size={30} />}>
          <SelectClasses
            orientation_id={orientation_id}
            implentation_id={implentation_id}
            years={year.filter((y) => value.includes(y.name)).map((y) => y.key)}
            allYears={year}
          />
        </Suspense>
      ) : null}
    </>
  );
}
