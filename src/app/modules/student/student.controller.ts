import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';

const getAllStudents = catchAsync(async (req, res) => {
  const searchQuery = req.query;

  const result = await StudentServices.getAllStudentsFromDB(searchQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students data retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const result = await StudentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  await StudentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data deleted successfully',
    data: null,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
