import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import {
  getClass,
  getCourse,
  getImplentations,
  getLocalSchedule,
  getLocaux,
  getOrientations,
  getYear,
} from "@/henallux";
import { z } from "zod";

export const henallux = createTRPCRouter({
  getImplentations: publicProcedure.query(async () => {
    try {
      return await getImplentations();
    } catch (e) {
      return null;
    }
  }),
  getOrientations: publicProcedure
    .input(z.object({ implentation_id: z.coerce.number() }))
    .query(async ({ input }) => {
      try {
        return await getOrientations(input.implentation_id);
      } catch (e) {
        return null;
      }
    }),
  getYear: publicProcedure
    .input(
      z.object({
        implentation_id: z.coerce.number(),
        orientation_id: z.coerce.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getYear(input.implentation_id, input.orientation_id);
    }),
  getClasses: publicProcedure
    .input(
      z.object({
        orientation_id: z.coerce.number(),
        year_id: z.array(z.coerce.number()),
        implentation_id: z.coerce.number(),
      }),
    )
    .query(async ({ input }) => {
      const classes = await Promise.all(
        input.year_id.map((id) =>
          getClass(id, input.orientation_id, input.implentation_id),
        ),
      );
      return classes.flat();
    }),
  getLessons: publicProcedure
    .input(z.array(z.coerce.number()))
    .query(async ({ input }) => {
      const courses = await Promise.all(input.map((id) => getCourse(id)));
      for (const course of courses) {
        course.courses = course.courses.reduce(
          (acc, c) => {
            if (acc.some((a) => a.text === c.text)) {
              return acc;
            }
            return acc.concat(c);
          },
          [] as typeof course.courses,
        );
      }
      return courses;
    }),
  getLocaux: publicProcedure
    .input(z.coerce.number())
    .query(async ({ input }) => {
      return await getLocaux(input);
    }),
  isLocalFree: publicProcedure
    .input(
      z.object({
        local_id: z.coerce.number(),
      }),
    )
    .query(async ({ input }) => {
      console.log("houres", new Date().getHours());
      console.log("minutes", new Date().getMinutes());
      const res = await getLocalSchedule(input.local_id, new Date());
      return res;
    }),
});
