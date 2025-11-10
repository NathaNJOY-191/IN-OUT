require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

// Basic root route so visiting / in a browser doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.send('In-out API is running. See /rooms and /auth endpoints.');
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/in-out';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_change_me';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RdEbrAgSxi8vul',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'qC9iRGDdBqWWo6Bo7AivZp4Z'
});

mongoose.connect(MONGODB_URI).then(() => console.log('Mongo connected')).catch((e) => console.error(e));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  full_name: String,
  role: { type: String, default: 'customer' },
}, { timestamps: true });

const RoomSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  price_per_night: Number,
  max_guests: Number,
  amenities: [String],
  image_url: String,
  is_available: { type: Boolean, default: true },
}, { timestamps: true });

const BookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  check_in_date: String,
  check_out_date: String,
  num_guests: Number,
  total_price: Number,
  status: { type: String, default: 'pending' },
  special_requests: String,
  payment_id: String,
  order_id: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Room = mongoose.model('Room', RoomSchema);
const Booking = mongoose.model('Booking', BookingSchema);

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, full_name });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id.toString(), email: user.email }, profile: { id: user._id.toString(), email: user.email, full_name: user.full_name, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id.toString(), email: user.email }, profile: { id: user._id.toString(), email: user.email, full_name: user.full_name, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({ user: { id: user._id.toString(), email: user.email }, profile: { id: user._id.toString(), email: user.email, full_name: user.full_name, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ price_per_night: 1 }).lean();
    const mapped = rooms.map(r => ({ ...r, id: r._id.toString() }));
    res.json(mapped);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/rooms/:id', async (req, res) => {
  try {
    const r = await Room.findById(req.params.id).lean();
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({ ...r, id: r._id.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/bookings/mine', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id }).populate('room_id').sort({ createdAt: -1 }).lean();
    const mapped = bookings.map(b => ({
      ...b,
      id: b._id.toString(),
      room: b.room_id ? { ...b.room_id, id: b.room_id._id.toString() } : undefined,
    }));
    res.json(mapped);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/bookings', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    const booking = await Booking.create(payload);
    res.json({ id: booking._id.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/bookings/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.user_id.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Razorpay order
app.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Verify payment
app.post('/verify-payment', authMiddleware, async (req, res) => {
  const crypto = require('crypto');
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update booking status
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.status = 'confirmed';
        booking.payment_id = razorpay_payment_id;
        booking.order_id = razorpay_order_id;
        await booking.save();
      }
      res.json({ success: true });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on', port));

module.exports = app;
