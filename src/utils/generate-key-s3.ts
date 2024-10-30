export const generateKeyS3 = (prePath: string, file: string) => {
  const [nameFile, extension] = file.split(".");
  return `${prePath}/${nameFile}_${Date.now()}.${extension}`;
};

export const getFileName = (pathFile: string) => {
  const nameFile = pathFile.split("/")[pathFile.split("/").length - 1];
  return nameFile;
}
export const getUrlFile = (pathFile: string) => `${import.meta.env.VITE_APP_S3_BUCKET_URL}/${pathFile}`;
