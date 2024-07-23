import { api } from "@/trpc/react";
import React, { Suspense, useEffect } from "react";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { Loading } from "./loading";
import SelectLessons from "./select-lessons";

export default function SelectClasses({
  orientation_id,
  implentation_id,
  years,
  allYears,
}: {
  orientation_id: number;
  implentation_id: number;
  years: number[];
  allYears: {
    key: number;
    name: string;
  }[];
}) {
  const [classes] = api.henallux.getClasses.useSuspenseQuery({
    orientation_id,
    implentation_id,
    year_id: years,
  });
  const options = classes.map((option) => {
    return {
      name: option.name,
      value: option.key.toString(),
    };
  });
  const [value, setValue] = React.useState<string[]>([]);
  useEffect(() => {
    console.log("reset");
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
          <MultiSelectorInput placeholder="Choisir les classes" />
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
          <SelectLessons
            orientation_id={orientation_id}
            implentation_id={implentation_id}
            classes={classes}
            classes_id={classes
              .filter((c) => value.includes(c.name))
              .map((c) => c.key)}
            yearsNames={allYears.map((y) => y.name)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
