import { FaFile } from "react-icons/fa";

export interface DownloadDialogProps {
  pathFile: string;
}

const DownloadAction: React.FC<DownloadDialogProps> = ({ pathFile }) => {  
  const nameFile = pathFile.split("/")[pathFile.split("/").length - 1];
  const urlFile = `${import.meta.env.VITE_APP_S3_BUCKET_URL}/${pathFile}`;

  return (
    <div className="flex gap-2">
      <a
        href={urlFile}
        download={nameFile}
        className="text-accent underline flex items-center"
        target="_blank"
      >
        <FaFile className="mr-1" />
        Download
      </a>
    </div>
  );
};

export default DownloadAction;
