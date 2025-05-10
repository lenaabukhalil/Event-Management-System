const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
//ALL ticket

// GET all tickets
router.get('/', async (req, res) => {
    console.log('GET /api/tickets endpoint hit');
    try {
      const tickets = await Ticket.find()
        .populate('user', 'name email')
        .populate('event', 'title date');
      
      console.log(`Found ${tickets.length} tickets`);
      res.json(tickets);
    } catch (err) {
      console.error('Ticket fetch error:', err);
      res.status(500).json({ 
        message: 'Failed to fetch tickets',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });
  
// Book ticket
router.post('/', async (req, res) => {
  try {
    const event = await Event.findById(req.body.event);
    const user = await User.findById(req.body.user);
    
    if (!event || !user) {
      return res.status(404).json({ message: 'Event or User not found' });
    }

    if (event.availableTickets < 1) {
      return res.status(400).json({ message: 'No tickets available' });
    }

    const ticket = new Ticket(req.body);
    await ticket.save();
    
    await event.bookTicket(1);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get tickets for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ event: req.params.eventId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel ticket
router.put('/:id/cancel', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const result = await ticket.cancelTicket();
    await Event.findByIdAndUpdate(ticket.event, { $inc: { availableTickets: 1 } });
    
    res.json({ message: result, ticket });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;