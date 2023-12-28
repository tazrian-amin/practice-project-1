import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  //   StudentMethods,
  StudentModel,
  TUserName,
} from './student.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//create schema
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name cannot have more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstNameStr === value;
      },
      message: '{VALUE} is not in correct format',
    },
  },
  middleName: {
    type: String,
    required: [true, 'Middle name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father's name is required"] },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required"],
  },
  motherName: { type: String, required: [true, "Mother's name is required"] },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required"],
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, "Local guardian's name is required"] },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required"],
  },
  contactNo: {
    type: String,
    required: [true, "Local guardian's contact number is required"],
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required"],
  },
});

// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    name: { type: userNameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender option',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian details are required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian details are required'],
    },
    profileImage: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Admission semester is required'],
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Department is required'],
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

studentSchema.virtual('fullName').get(function () {
  return this.name
    ? `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
    : '';
});

//using Query middleware / hook
studentSchema.pre('save', async function (next) {
  const isStudentExists = await Student.findOne({
    id: this.id,
  });
  if (isStudentExists) {
    throw new AppError(httpStatus.CONFLICT, 'Student already exists');
  }
  next();
});

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//using Aggregate middleware / hook
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//using Statics
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

//using Methods
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

//create model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
