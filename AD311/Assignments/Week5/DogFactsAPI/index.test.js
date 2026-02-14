const request = require('supertest');
const { app } = require('./index');

test('test case 1: test facts route', async () => {
  const res = await request(app).get('/facts');
  const json = JSON.parse(res.text);
  expect(res.statusCode).toEqual(200);
  expect(json.facts[0].length).toEqual(435);
});

test('test case 2: test faces route number', async () => {
  const res = await request(app).get('/facts/5');
  const json = JSON.parse(res.text);
  expect(res.statusCode).toEqual(200);
  expect(json.facts[0].length).toEqual(5);
});

test('test case 3: test faces route number 2', async () => {
  const res = await request(app).get('/facts/100');
  const json = JSON.parse(res.text);
  expect(res.statusCode).toEqual(200);
  expect(json.facts[0].length).toEqual(100);
});

test('edge case 1: get out of bounds data', async () => {
  const res = await request(app).get('/facts/600');
  const json = JSON.parse(res.text);
  expect(res.statusCode).toEqual(200);
  expect(json.facts[0].length).toEqual(435);
});

test('edge case 2: get data using negative number', async () => {
  const res = await request(app).get('/facts/-1');
  expect(res.statusCode).toEqual(404);
});

test('edge case 3: get data using a string', async () => {
  const res = await request(app).get('/facts/test');
  expect(res.statusCode).toEqual(404);
});
