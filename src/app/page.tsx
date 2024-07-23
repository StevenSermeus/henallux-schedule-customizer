import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Loading } from "./_components/loading";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import SelectImplentation from "./_components/select-implentation";
import ErrorHandler from "./_components/ErrorBondary";
export const runtime = "edge";
export default async function Home() {
  void api.henallux.getImplentations.prefetch();
  return (
    <HydrateClient>
      {/* 90vh */}
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container py-24 lg:py-32">
          {/* Title */}
          <div className="mx-auto mt-5 max-w-2xl text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Customise ton Horaire
            </h1>
          </div>
          {/* End Title */}
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <p className="text-xl text-muted-foreground">
              Avoir un fichier horaire qui te convient n&apos;a jamais été aussi
              simple
            </p>
          </div>
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-x-1 gap-y-5 sm:gap-x-3">
            <ErrorBoundary errorComponent={ErrorHandler}>
              <Suspense fallback={<Loading size={30} />}>
                <SelectImplentation />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={"https://www.stevensermeus.be/"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Steven Sermeus
            </a>
            . The source code is available on{" "}
            <a
              href={
                "https://github.com/StevenSermeus/henallux-schedule-customizer"
              }
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
            Si vous avez des questions ou des suggestions, n&apos;hésitez pas à
            me contacter par discord : stevensensei 😃
          </p>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 text-center md:h-24 md:flex-row">
          <p>Copyright © 2024</p>
          <p>Ce site n&apos;est aucunement affilié à l&apos;Hénallux</p>
        </div>
      </footer>
    </HydrateClient>
  );
}
