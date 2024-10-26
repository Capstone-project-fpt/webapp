export const generateKeyS3 = (prePath: string, nameFile: string) =>
  `${prePath}/${nameFile}_${Date.now()}`;
