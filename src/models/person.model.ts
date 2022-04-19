import mongoose, { Types, Schema } from "mongoose";

export interface PersonInput {
  name: string;
  lastName: string;
  address: string;
  gender: string;
  job: string;
  age: number;
}

export interface PersonDocument extends PersonInput {
  updatedAt: Date;
  createdAt: Date;
}

const PersonSchema = new mongoose.Schema<PersonDocument>(
  {
    name: { type: String, required: [true, "name required"] },
    lastName: { type: String },
    address: { type: String, required: [true, "address required"] },
    gender: { type: String, required: [true, "gender is required"] },
    job: { type: String },
    age: { type: Number, min: [18, "age must be adult"] },
  },
  {
    timestamps: true, // to create updatedAt and createdAt
  }
);

const PersonModel = mongoose.model("Person", PersonSchema);
export default PersonModel;
