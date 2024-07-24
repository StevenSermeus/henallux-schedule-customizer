import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Loading } from "./_components/loading";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import SelectImplentation from "./_components/select-implentation";
import ErrorHandler from "./_components/ErrorBondary";
export const runtime = "edge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  void api.henallux.getImplentations.prefetch();
  return (
    <HydrateClient>
      <div className="min-w-screen mx-auto min-h-[calc(100vh-4rem)] justify-center">
        <Tabs
          defaultValue="agenda"
          className="mx-auto w-[600px] py-24 lg:py-32"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="q&a">Q & A</TabsTrigger>
          </TabsList>
          <div className="container justify-center">
            <TabsContent value="agenda">
              {/* Title */}
              <div className="mx-auto mt-5 max-w-2xl text-center">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Customise ton Horaire
                </h1>
              </div>
              {/* End Title */}
              <div className="mx-auto mt-5 max-w-3xl text-center">
                <p className="text-xl text-muted-foreground">
                  Avoir un fichier horaire qui te convient n&apos;a jamais été
                  aussi simple
                </p>
              </div>
              <div className="mt-5 flex w-full flex-col items-center justify-center gap-x-1 gap-y-5 sm:gap-x-3">
                <ErrorBoundary errorComponent={ErrorHandler}>
                  <Suspense fallback={<Loading size={30} />}>
                    <SelectImplentation />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </TabsContent>
            <TabsContent value="local">
              <div className="mx-auto mt-5 max-w-2xl text-center">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Est ce que le local est libre ?
                </h1>
              </div>
              <div className="mt-5 flex w-full flex-col items-center justify-center gap-x-1 gap-y-5 sm:gap-x-3">
                <ErrorBoundary errorComponent={ErrorHandler}>
                  <Suspense fallback={<Loading size={30} />}>
                    <SelectImplentation isLocal={true} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </TabsContent>
            <TabsContent value="q&a">
              <div className="container justify-center">
                <div className="mx-auto mt-5 max-w-2xl text-center">
                  <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Question & Réponse
                  </h2>
                </div>
                <div className="mx-auto mt-5 max-w-3xl text-center">
                  <p className="text-xl text-muted-foreground">
                    Pourquoi il y a des noms de cours étrange ? (ex: Porte
                    ouverte, Vacances, ...)
                  </p>
                  <p>
                    Les différents &quot;cours&quot; sont généré depuis les
                    événements présent dans le calendrier. De ce fait il est
                    compliqué de faire la différence entre un vrai cours et la
                    journée porte ouverte.
                  </p>
                </div>
                <div className="mx-auto mt-5 max-w-3xl text-center">
                  <p className="text-xl text-muted-foreground">
                    Quel est la différence entre télécharger et copier le lien ?
                  </p>
                  <p>
                    Télécharger permet de télécharger le fichier horaire sur
                    votre appareil. Copier le lien permet de partager le fichier
                    horaire avec d&apos;autres personnes ou de l&apos;utiliser
                    dans votre application d&apos;agenda favori qui propose la
                    fonctionnalité d&apos;importation via un lien. (Sur Calendar
                    mac il est même possible de mettre à jour tout les x temps
                    l&apos;agenda sur base du lien)
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
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
