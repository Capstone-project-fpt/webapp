export const generateKeyS3 = (prePath: string, file: string) => {
  const [nameFile, extension] = file.split(".");
  return `${prePath}/${nameFile}_${Date.now()}.${extension}`;
};
