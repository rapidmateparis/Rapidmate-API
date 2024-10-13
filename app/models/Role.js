const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{
    menu: { type: Schema.Types.ObjectId, ref: 'Menu' },  // Linking to Menu table
    canView: { type: Boolean, default: false },
    canAdd: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  }]
},{ timestamps: true});

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
