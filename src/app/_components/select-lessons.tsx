import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { CalendarIcon, ClipboardIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface Value {
  name: string; // Class name - course name
  value: {
    class_id: number;
    course_name: string;
  };
}

export default function SelectLessons({
  classes_id,
  classes,
  orientation_id,
  implentation_id,
  yearsNames,
}: {
  classes_id: number[];
  classes: {
    key: number;
    name: string;
  }[];
  yearsNames: string[];
  orientation_id: number;
  implentation_id: number;
}) {
  const [lessons] = api.henallux.getLessons.useSuspenseQuery(classes_id);
  const [value, setValue] = React.useState<string[]>([]);
  const options = lessons.map((lessons_by_class) => {
    return lessons_by_class.courses.map((course) => {
      return {
        name: `${classes.find((c) => c.key === lessons_by_class.class_id)?.name} - ${course.text}`,
        value: {
          class_id: lessons_by_class.class_id,
          course_name: course.text,
        },
      };
    });
  });

  const urlVal = value.map<Value>((v) => {
    const class_name = v.split(" - ")[0] ?? "";
    const course_name = v.split(" - ")[1] ?? "";
    return {
      name: course_name,
      value: {
        class_id: classes.find((c) => c.name === class_name)?.key ?? 0,
        course_name,
      },
    };
  });

  const url = generateUrl(
    urlVal,
    implentation_id,
    orientation_id,
    classes,
    yearsNames,
  );
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
          <MultiSelectorInput placeholder="Cours" />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {options.flat().map((option, i) => (
              <MultiSelectorItem key={i} value={option.name}>
                {option.name}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
      {value.length > 0 ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(url)
                      .then(() => {
                        toast.success("Copied to clipboard");
                      })
                      .catch(() => {
                        toast.error("Failed to copy to clipboard");
                      });
                  }}
                >
                  Copier le lien <ClipboardIcon className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click pour copier le lien</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(url, "_blank");
                    toast.success("Téléchargement commencé");
                  }}
                >
                  Télécharger
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click pour télécharger le fichier ICS</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : null}
    </>
  );
}

function generateUrl(
  lessons: Value[],
  implentation_id: number,
  orientation_id: number,
  classes: { key: number; name: string }[],
  yearnNames: string[],
) {
  const url = new URL(`${window.location.origin}/api/calendar`);
  url.searchParams.append("implentation_id", implentation_id.toString());
  url.searchParams.append("orientation_id", orientation_id.toString());
  const lessons_to_be_encoded = lessons.map((lesson) => {
    return encodeURIComponent(
      `${classes.find((c) => c.key === lesson.value.class_id)?.name} - ${lesson.value.course_name}`,
    );
  });
  url.searchParams.append("years", yearnNames.join(","));

  url.searchParams.append("lessons", lessons_to_be_encoded.join(","));
  return url.toString();
}
