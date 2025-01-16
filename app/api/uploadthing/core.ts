import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) throw new Error("No autorizado");

  return { userId };
};

// FileRouter para tu aplicación, puede contener múltiples FileRoutes
export const ourFileRouter = {
  // Define tantos FileRoutes como necesites, cada uno con un routeSlug único
  image: f({ image: { maxFileCount: 6 }, video: { maxFileCount: 3 } })
    // Establece permisos y tipos de archivos para este FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  file: f(["image", "video", "audio", "pdf"])
    // Establece permisos y tipos de archivos para este FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
