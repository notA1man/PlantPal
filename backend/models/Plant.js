import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  lastWatered: Date,
  lastFertilized: Date,
  notes: String,
  spriteIndex: { type: Number, min: 1, max: 5, default: 1 },
  suggestions: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Plant', plantSchema);

