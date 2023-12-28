import { Model, Types } from 'mongoose';

//create interface
export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TGender = 'male' | 'female' | 'other';

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

//using Statics
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TStudent | null>;
}

//using Methods
// export type StudentMethods = {
//   isUserExists(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
