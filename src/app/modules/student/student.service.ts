// import { TStudent } from './student.interface';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import { processField } from '../../utils/processField';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   //   const result = await Student.create(studentData); //default data creation

//   //using Methods
//   //   const student = new Student(studentData); //instance of Student
//   //   if (await student.isUserExists(studentData.id)) {
//   //     throw new Error('User already exists!');
//   //   }
//   //   const result = await student.save(); //built in static method

//   //using Statics
// if (await Student.isUserExists(studentData.id)) {
//   throw new Error('User already exists');
// }

//   const result = await Student.create(studentData);
//   return result;
// };

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //searching
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

  // let searchTerm = '';
  // const queryObject = { ...query };

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // //filtering
  // const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  // excludedFields.forEach((element) => delete queryObject[element]);

  // const filterQuery = searchQuery
  //   .find(queryObject)
  //   .populate(['user', 'admissionSemester'])
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: { path: 'academicFaculty' },
  //   });

  // //sorting
  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // //pagination & limiting
  // let page = 1;
  // let limit = 100;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // //field limiting
  // let fields = '-__v';

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate(['user', 'admissionSemester'])
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate(['user', 'admissionSemester'])
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  processField('name', name, modifiedUpdatedData);
  processField('guardian', guardian, modifiedUpdatedData);
  processField('localGuardian', localGuardian, modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const isStudentExists = await Student.isUserExists(id);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exist!');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete student!',
    );
  }
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
