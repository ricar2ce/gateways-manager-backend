const { assert } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Gateway = require('../models/gateway');

describe('Gateway API', () => {
  before(async () => {
    // Connect to the test database
    const MONGODB_URI = 'mongodb://localhost:27017/gateway-manager-test';
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    Gateway.deleteMany({}, () => {
    });
  });

  after(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  describe('POST /api/gateways', () => {
    it('should add a new gateway', async () => {
      const res = await request(app)
        .post('/api/gateways')
        .send({ serialNumber: 'GATEWAY001', name: 'Gateway 1', ipv4Address: '192.168.1.1' });
      assert.equal(res.statusCode, 201);
      assert.isNotNull(res.body);
      assert.equal(res.body.serialNumber, 'GATEWAY001');
      assert.equal(res.body.name, 'Gateway 1');
      assert.equal(res.body.ipv4Address, '192.168.1.1');
    });

    it('should return an error for missing fields', async () => {
      const res = await request(app)
        .post('/api/gateways')
        .send({ name: 'Gateway 2', ipv4Address: '192.168.1.2' });
      assert.equal(res.statusCode, 400);
      assert.equal(res.body.message, '"serialNumber" is required');
    });
  });

  describe('GET /api/gateways', () => {
    it('should return all gateways', async () => {
      const res = await request(app).get('/api/gateways');
      assert.equal(res.statusCode, 200);
      assert.isArray(res.body);
      assert.lengthOf(res.body, 1);
      assert.equal(res.body[0].serialNumber, 'GATEWAY001');
      assert.equal(res.body[0].name, 'Gateway 1');
      assert.equal(res.body[0].ipv4Address, '192.168.1.1');
      assert.property(res.body[0], 'peripheralDevices');
      assert.isArray(res.body[0].peripheralDevices);
      assert.lengthOf(res.body[0].peripheralDevices, 0);
    });
  });

  describe('GET /api/gateways/:serialNumber', () => {
    it('should return a single gateway', async () => {
      const res = await request(app)
        .get('/api/gateways/GATEWAY001');
      assert.equal(res.statusCode, 200);
      assert.isNotNull(res.body);
      assert.equal(res.body.serialNumber, 'GATEWAY001');
      assert.equal(res.body.name, 'Gateway 1');
      assert.equal(res.body.ipv4Address, '192.168.1.1');
      assert.property(res.body, 'peripheralDevices');
      assert.isArray(res.body.peripheralDevices);
      assert.lengthOf(res.body.peripheralDevices, 0);
    });

    it('should return an error for a nonexistent gateway', async () => {
      const res = await request(app)
        .get('/api/gateways/GATEWAY002');
      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'Gateway not found');
    });
  });

  describe('PUT /api/gateways/:serialNumber', () => {
    it('should update a gateway', async () => {
      const res = await request(app)
        .put('/api/gateways/GATEWAY001')
        .send({ name: 'Gateway 1 Updated', ipv4Address: '192.168.1.1' });
    });

    it('should return an error for a nonexistent gateway', async () => {
      const res = await request(app)
        .put('/api/gateways/GATEWAY002')
        .send({ name: 'Gateway 2 Updated', ipv4Address: '192.152.1.1' });
      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'Gateway not found');
    });

    it('should return an error for missing fields', async () => {
      const res = await request(app)
        .put('/api/gateways/GATEWAY001')
        .send({ name: 'Gateway 1 Updated' });
      assert.equal(res.statusCode, 400);
      assert.equal(res.body.message, '"ipv4Address" is required');
    });
  });

  describe('DELETE /api/gateways/:serialNumber', () => {
    it('should delete a gateway', async () => {
      const res = await request(app)
        .delete('/api/gateways/GATEWAY001');
      assert.equal(res.statusCode, 200);
      assert.isNotNull(res.body);
      assert.equal(res.body.serialNumber, 'GATEWAY001');
    });

    it('should return an error for a nonexistent gateway', async () => {
      const res = await request(app)
        .delete('/api/gateways/GATEWAY002');
      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'Gateway not found');
    });
  });
});
