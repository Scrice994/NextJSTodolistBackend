import { InferSchemaType, Schema, model } from "mongoose";

const emailVerificationTokenSchema = new Schema({
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expire: "10m" }
});

export type EmailVerificationToken = InferSchemaType<typeof emailVerificationTokenSchema>;

export default model<EmailVerificationToken>("verificationToken", emailVerificationTokenSchema);