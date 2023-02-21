const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  ipv4Address: {
    type: String,
    required: true,
    unique: true,
    match: /^(\d{1,3}\.){3}\d{1,3}$/,
  },
  peripheralDevices: [
    {
      uid: {
        type: Number,
        required: true,
        unique: true,
      },
      vendor: {
        type: String,
        required: true,
      },
      dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
      },
      status: {
        type: String,
        required: true,
        enum: ['online', 'offline'],
        default: 'offline',
      },
    },
  ],
});

gatewaySchema.pre('save', function (next) {
  const gateway = this;
  if (gateway.peripheralDevices.length > 10) {
    const error = new Error('No more than 10 devices are allowed per gateway');
    next(error);
  }
  next();
});

const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway;
