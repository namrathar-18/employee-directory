import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.passwordHash; // never expose the hash
        return ret;
      },
    },
  },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema);
