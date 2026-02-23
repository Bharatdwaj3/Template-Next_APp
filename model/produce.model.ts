// models/produce.model.ts
import { Schema, model } from 'mongoose';

const produceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'honey', 'eggs', 'processed', 'other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'piece', 'bunch', 'liter', 'pack', 'dozen'],
    required: true,
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0,
  },
  farmer: {
    type: Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  mediaUrl: { type: String, default: '' },
  cloudinaryId: { type: String, default: '' },
  isOrganic: { type: Boolean, default: false },
  harvestDate: { type: Date },
}, {
  timestamps: true,
});

export default model('Produce', produceSchema, 'produces');