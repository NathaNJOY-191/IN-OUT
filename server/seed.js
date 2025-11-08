require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/in-out';

const RoomSchema = new mongoose.Schema({}, { strict: false });
const Room = mongoose.model('Room', RoomSchema, 'rooms');

async function run() {
  await mongoose.connect(MONGODB_URI);
  await Room.deleteMany({});
  
  // Read rooms from JSON file
  const roomsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'rooms.json'), 'utf-8')
  );
  const rooms = roomsData.rooms;
  await Room.insertMany(rooms);
  console.log('Seeded rooms');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
