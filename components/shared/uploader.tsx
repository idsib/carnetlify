import React = require("react");

import { UploadDropzone } from "@/lib/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import { toast } from "sonner";

type Props = {
  onChange: (urls: string[]) => void;
  type: "image" | "file";
};

const Uploader = ({ type, onChange }: Props) => {
  return (
    <UploadDropzone
      endpoint={type}
      onClientUploadComplete={(res: { url: any; }[]) => onChange(res.map((item: { url: any; }) => item.url))}
      onUploadError={(error: UploadThingError<Json>) => {
        toast.error(error.message);
      }}
    />
  );
};

export default Uploader;
