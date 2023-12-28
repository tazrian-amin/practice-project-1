import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department name must be string',
      required_error: 'Academic Department name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty name must be string',
      required_error: 'Academic Faculty is required',
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department name must be string',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Department name must be string',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
