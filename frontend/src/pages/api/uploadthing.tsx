import { createUploadthing } from 'uploadthing/next-legacy';
import { createRouteHandler } from "uploadthing/next-legacy";

const f = createUploadthing();

const ourFileRouter : any = {
  editorUploader: f([
    'image', 'text', 'blob', 'pdf', 'video', 'audio'
  ])
  .middleware(() => {
    return {};
  })
  .onUploadComplete(async ({}) => {
  }),
};

export type OurFileRouter = typeof ourFileRouter;

export default createRouteHandler({
  router: ourFileRouter,
});