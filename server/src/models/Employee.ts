import { Schema, model, InferSchemaType } from 'mongoose';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../constants';

const employeeSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: '' },
    department: { type: String, required: true, enum: DEPARTMENTS, index: true },
    jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, default: '' },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, default: 'Full-time' },
    status: { type: String, enum: EMPLOYEE_STATUSES, default: 'Active', index: true },
    hireDate: { type: Date, required: true, default: Date.now },
    bio: { type: String, trim: true, maxlength: 600, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        return ret;
      },
    },
  },
);

employeeSchema.virtual('fullName').get(function (this: { firstName: string; lastName: string }) {
  return `${this.firstName} ${this.lastName}`.trim();
});

export type EmployeeDocument = InferSchemaType<typeof employeeSchema>;

export const Employee = model('Employee', employeeSchema);
