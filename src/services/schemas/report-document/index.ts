import * as yub from "yup";

interface CreateReportDocument {
  name: string;
}

export const createReportDocumentSchema: yub.ObjectSchema<CreateReportDocument> =
  yub.object({
    name: yub.string().required("Name field is required"),
  });
