const { getDogData, getDogDataById, getDogFacts, getDogGroups } = require('./index');

test('test case 1: getDogData', async () => {
  const response = await getDogData();
  expect(response).not.toBeUndefined();
});

test('test case 2: getDogFacts', async () => {
  const response = await getDogFacts();
  expect(response).not.toBeUndefined();
});

test('test case 3: getDogGroups', async () => {
  const response = await getDogGroups();
  expect(response).not.toBeUndefined();

});

test('test case 4: getDogDataById', async () => {
  const response = await getDogDataById("5462fedb-7f80-49c5-98c3-8ce3207e7d03");
  expect(response.data.attributes.name).toEqual('Drentsche Patrijshond');
});

test('edge case 1: get non-existent dog data', async () => {
  try {
    await getDogDataById("-1");
  } catch (err) {
    expect(err).toEqual(Error("Response status: 404"));
  }
});

test('edge case 2: get random dog', async () => {
  const response = await getDogData();
  expect(response.data[Math.round(Math.random() * response.data.length)]).not.toBeUndefined();
});

test('edge case 3: get first dog attributes', async () => {
  const response = await getDogData();
  expect(response.data[0].attributes.name).toEqual("Affenpinscher");
});
