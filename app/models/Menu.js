const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  name: { type: String, required: true, unique: true },// e.g., "vehicle", "driver"
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
},{ timestamps: true });

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
