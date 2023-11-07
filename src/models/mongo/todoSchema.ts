import { InferSchemaType, Schema, model } from "mongoose";
import * as uuid from 'uuid';

const todoSchema = new Schema({
    text: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    userId: { type: String, require: true },
    id: { type: String, default: uuid.v4, unique: true },
}, { timestamps: true });

type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>('Todo', todoSchema);
