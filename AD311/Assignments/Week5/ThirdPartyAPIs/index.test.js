const { generateRandomDnDCharacter, getRaceByIndex, getClassByIndex, getAlignmentByIndex } = require('./index');

test('test case 1: generate random D&D character', async () => {
  const genChar = await generateRandomDnDCharacter();
  expect(genChar[0]).not.toBeUndefined();
  expect(genChar[1]).not.toBeUndefined();
  expect(genChar[2]).not.toBeUndefined();
});

test('test case 2: get human race data', async () => {
  const data = await getRaceByIndex("human");
  expect(data.name).toEqual("Human");
});

test('test case 3: get fighter class data', async () => {
  const data = await getClassByIndex("fighter");
  expect(data.name).toEqual("Fighter");
});

test('test case 4: get neutral alignment data', async () => {
  const data = await getAlignmentByIndex("neutral");
  expect(data.name).toEqual("Neutral");
});

test('edge case 1: get non-existent race data', async () => {
  try {
    await getRaceByIndex("drow-elf");
  } catch (err) {
    expect(err).toEqual(Error("Response status: 404\nURL: https://www.dnd5eapi.co/api/2014/races/drow-elf"));
  }
});

test('edge case 2: get non-existent class data', async () => {
  try {
    await getClassByIndex("artificer");
  } catch (err) {
    expect(err).toEqual(Error("Response status: 404\nURL: https://www.dnd5eapi.co/api/2014/classes/artificer"));
  }
});

test('edge case 3: get non-existent alignment data', async () => {
  try {
    await getAlignmentByIndex("chaotic-stupid");
  } catch (err) {
    expect(err).toEqual(Error("Response status: 404\nURL: https://www.dnd5eapi.co/api/2014/alignments/chaotic-stupid"));
  }
});
