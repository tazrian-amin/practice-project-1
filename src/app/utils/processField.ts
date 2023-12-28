export const processField = (
  fieldName: string,
  fieldData: Record<string, unknown> | undefined,
  modifiedUpdatedData: Record<string, unknown>,
) => {
  if (fieldData && Object.keys(fieldData).length) {
    for (const [key, value] of Object.entries(fieldData)) {
      modifiedUpdatedData[`${fieldName}.${key}`] = value;
    }
  }
};
