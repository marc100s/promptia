import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required.'],
      maxlength: [5000, 'Prompt cannot exceed 5000 characters'],
      trim: true,
    },
    tag: {
      type: String,
      required: [true, 'Tag is required.'],
      maxlength: [50, 'Tag cannot exceed 50 characters'],
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create text index for full-text search
PromptSchema.index({ prompt: 'text', tag: 'text' });

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;