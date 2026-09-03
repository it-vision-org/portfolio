import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAdminUser } from "@/lib/session";

const f = createUploadthing();

/** Only a signed-in admin may upload. */
async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
}

export const ourFileRouter = {
  // Generic images: project covers, UI/UX screenshots, certification images,
  // client logos, graphic-design items, about photo.
  image: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(requireAdmin)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // Navbar / home logos.
  logo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireAdmin)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // CV / resume PDF.
  pdf: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(requireAdmin)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // Optional project video upload (demos are usually external links).
  video: f({ video: { maxFileSize: "128MB", maxFileCount: 1 } })
    .middleware(requireAdmin)
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
