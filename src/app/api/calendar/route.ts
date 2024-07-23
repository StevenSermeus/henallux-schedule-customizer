import { getClass, getCourse, getYear } from "@/henallux";
import * as ics from "ics";
function decodeUrl(url: string) {
  const urlObj = new URL(url);
  const implentation_id = parseInt(
    urlObj.searchParams.get("implentation_id") ?? "0",
  );
  const orientation_id = parseInt(
    urlObj.searchParams.get("orientation_id") ?? "0",
  );
  const lessons = urlObj.searchParams
    .get("lessons")
    ?.split(",")
    .map((lesson) => {
      const [class_name, course_name] = decodeURIComponent(lesson).split(" - ");
      if (!class_name || !course_name) {
        return null;
      }
      return {
        class_name,
        course_name,
      };
    });
  const yearNames = urlObj.searchParams.get("years")?.split(",") ?? [];
  const filtered_lessons = lessons?.filter((lesson) => lesson !== null);
  if (!filtered_lessons) {
    return null;
  }
  return {
    implentation_id,
    orientation_id,
    lessons: filtered_lessons,
    yearNames,
  };
}

export async function GET(request: Request) {
  const decoded = decodeUrl(request.url);
  if (decoded === null) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
  const { implentation_id, orientation_id, lessons, yearNames } = decoded;
  // get all years in the orientation
  const years = await getYear(implentation_id, orientation_id);
  //filter the years to get the selected ones
  const selectedYears = years.filter((year) => yearNames.includes(year.name));
  // get all classes for the selected years
  const classes = await Promise.all(
    selectedYears.map((year) =>
      getClass(year.key, orientation_id, implentation_id),
    ),
  );
  //get all class names for the selected lessons
  const selectedClassNames = lessons.map((lesson) => lesson.class_name);
  //filter the classes to get the selected ones
  const selectedClasses = classes
    .flat()
    .filter((cls) => selectedClassNames.includes(cls.name));
  //get all lessons for the selected classes
  const lessonsByClass = await Promise.all(
    selectedClasses.map((cls) => getCourse(cls.key)),
  );
  const events = await Promise.all(
    lessons.map((lesson) =>
      createEvents(lesson, selectedClasses, lessonsByClass),
    ),
  );
  const flatEvents = events.flat().filter((event) => event !== null);
  const res = ics.createEvents(flatEvents);
  if (res.error ?? !res.value) {
    console.error(res.error, "Failed to create ics file");
    return Response.json({ error: res.error }, { status: 500 });
  }

  return new Response(
    new File([res.value], "calendar.ics", { type: "text/calendar" }),
    { status: 200 },
  );
}

async function createEvents(
  lessons: {
    class_name: string;
    course_name: string;
  },
  classes: {
    key: number;
    name: string;
  }[],
  lessonsByClass: {
    courses: {
      location: string;
      title: string;
      start: string;
      end: string;
      promotions: string;
      text: string | undefined;
    }[];
    class_id: number;
  }[],
) {
  const class_id = classes.find((cls) => cls.name === lessons.class_name)?.key;
  if (!class_id) {
    return null;
  }
  const lessonsForClass = lessonsByClass.find(
    (lesson) => lesson.class_id === class_id,
  );
  if (!lessonsForClass) {
    return null;
  }
  const events = [];
  for (const lesson of lessonsForClass.courses) {
    if (lesson.end === undefined || lesson.start === undefined) {
      continue;
    }
    if (lesson.text?.includes(lessons.course_name) === false) {
      continue;
    }
    events.push({
      title: lesson.title,
      location: lesson.location,
      description: lesson.text,
      start: convertTimestampToArray(lesson.start),
      end: convertTimestampToArray(lesson.end),
    });
  }
  return events;
}

function convertTimestampToArray(timestamp: string) {
  const year = parseInt(timestamp.slice(0, 4));
  const month = parseInt(timestamp.slice(4, 6));
  const day = parseInt(timestamp.slice(6, 8));
  const hour = parseInt(timestamp.slice(9, 11));
  const minute = parseInt(timestamp.slice(11, 13));
  // The example array does not include seconds, so we will omit them.

  return [year, month, day, hour, minute] as [
    number,
    number,
    number,
    number,
    number,
  ];
}
