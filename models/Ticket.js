const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketNumber: { type: String, unique: true }, // احذف required
  paymentMethod: { type: String, enum: ['Cash', 'Credit Card', 'Bank Transfer', 'E-Wallet'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' },
}, { timestamps: true });

// ✅ توليد ticketNumber تلقائياً قبل الحفظ
ticketSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// طريقة الإلغاء (كما في السابق)
ticketSchema.methods.cancelTicket = function () {
  this.status = 'Cancelled';
  return this.save().then(() => 'Ticket cancelled successfully');
};

module.exports = mongoose.model('Ticket', ticketSchema);
