const express = require('express');
const Joi = require('joi');
const Gateway = require('../models/gateway');

const router = express.Router();

// Define el esquema de validación para la creación de un gateway
const gatewaySchema = Joi.object({
  serialNumber: Joi.string().required(),
  name: Joi.string().required(),
  ipv4Address: Joi.string().required().ip({ version: 'ipv4' })
    .messages({
      'string.ip': 'ipv4Address must be a valid IPv4 address',
      'any.required': '"ipv4Address" is required',
    }),
  peripheralDevices: Joi.array().items(Joi.object({
    uid: Joi.number().required(),
    vendor: Joi.string().required(),
    dateCreated: Joi.date().required(),
    status: Joi.string().valid('online', 'offline').required(),
  })).max(10),
});

// Route to get all gateways and their devices
router.get('/', async (req, res) => {
  try {
    const gateways = await Gateway.find();
    return res.json(gateways);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to get a specific gateway and its devices
router.get('/:serialNumber', async (req, res) => {
  try {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serialNumber });
    if (!gateway) {
      return res.status(404).json({ message: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  return res;
});

// Route to create a new gateway
router.post('/', async (req, res) => {
  try {
    const gateway = req.body;

    // Validates that the request complies with the defined validation scheme
    const { error } = gatewaySchema.validate(gateway);

    if (error) {
      // If there is an error in the validation, it returns a 400 error
      return res.status(400).json({
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    const gatewayExists = await Gateway.findOne({
      serialNumber: gateway.serialNumber,
    }).exec();

    if (gatewayExists) {
      return res.status(400).json({ message: 'Gateway already exists' });
    }

    const newGateway = await Gateway.create(gateway);
    return res.status(201).json(newGateway);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route to update an existing gateway
router.put('/:serialNumber', async (req, res) => {
  try {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serialNumber });

    if (!gateway) {
      return res.status(404).json({ message: 'Gateway not found' });
    }

    const updateGateway = req.body;
    updateGateway.serialNumber = req.params.serialNumber;

    // Validates that the request complies with the defined validation scheme
    const { error } = gatewaySchema.validate(updateGateway);

    if (error) {
      // If there is an error in the validation, it returns a 400 error
      return res.status(400).json({
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    Object.keys(req.body).forEach((key) => {
      gateway[key] = req.body[key];
    });
    await gateway.save();

    return res.json(gateway);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route to delete a gateway
router.delete('/:serialNumber', async (req, res) => {
  try {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serialNumber });
    if (!gateway) {
      return res.status(404).json({ message: 'Gateway not found' });
    }
    await gateway.remove();
    return res.status(200).json({ serialNumber: req.params.serialNumber });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to add a device to a gateway
router.post('/:serial/devices', async (req, res) => {
  try {
    const gateway = await this.findOne({ serialNumber: req.params.serial });
    if (!gateway) {
      throw new Error('Gateway not found');
    }

    // Agrega el dispositivo al array de dispositivos del gateway
    gateway.peripheralDevices.push(req.body);

    // Guarda el gateway actualizado en la base de datos
    await gateway.save();
    return res.status(201).json(gateway);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route to remove a device from a gateway
router.delete('/:serial/devices/:uid', async (req, res) => {
  try {
    const gateway = await Gateway.updateOne(
      { serialNumber: req.params.serial },
      { $pull: { devices: { uid: req.params.uid } } },
    );

    if (gateway.nModified === 1) {
      return res.status(204).send();
    }

    return res.status(404).json({ message: 'Device not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
