const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true },
  ticketPrice: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  availableTickets: { type: Number, default: function() { return this.capacity; } },
  category: { type: String, enum: ["Concert", "Conference", "Workshop", "Seminar", "Exhibition"], default: "Seminar" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

eventSchema.pre("save", function(next) {
  if (this.availableTickets > this.capacity) {
    throw new Error("Available tickets cannot exceed total capacity");
  }
  next();
});

eventSchema.methods.bookTicket = function(quantity) {
  if (this.availableTickets >= quantity) {
    this.availableTickets -= quantity;
    return this.save();
  }
  throw new Error("Not enough available tickets");
};

module.exports = mongoose.model("Event", eventSchema);