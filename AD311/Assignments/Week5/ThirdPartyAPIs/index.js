const races = ["dragonborn", "dwarf", "elf", "gnome", "half-elf",
  "half-orc", "halfling", "human", "tiefling"];
const classes = ["barbarian", "bard", "cleric", "druid", "fighter",
  "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard"];
const alignments = ["chaotic-neutral", "chaotic-evil", "chaotic-good",
  "lawful-neutral", "lawful-evil", "lawful-good", "neutral", "neutral-evil",
  "neutral-good"];


async function generateRandomDnDCharacter() {

  const url = "https://www.dnd5eapi.co/api/2014"

  try {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    const randRace = races[Math.round(Math.random() * races.length)];
    const responseRace = await fetch(`${url}/races/${randRace}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseRace.ok) {
      throw new Error(`Response status: ${responseRace.status}\nURL: ${url}/races/${randRace}`);
    }

    const randClass = classes[Math.round(Math.random() * races.length)];
    const responseClass = await fetch(`${url}/classes/${randClass}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseClass.ok) {
      throw new Error(`Response status: ${responseClass.status}\nURL: ${url}/classes/${randClass}`);
    }

    const randAlignment = alignments[Math.round(Math.random() * races.length)];
    const responseAlignment = await fetch(`${url}/alignments/${randAlignment}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseAlignment.ok) {
      throw new Error(`Response status: ${responseAlignment.status}\nURL: ${url}/alignments/${randAlignment}`);
    }

    console.log("Random D&D Character\n");
    console.log(
      `Race: ${randRace}\n
      Class: ${randClass}\n
      Alignment: ${randAlignment}`
    );

    response1 = await responseRace.json();
    response2 = await responseClass.json();
    response3 = await responseAlignment.json();

    console.log(response1);
    console.log(response2);
    console.log(response3);

    return [response1, response2, response3];

  }
  catch (err) {
    console.error(err);
    throw err;
  };
}

async function getRaceByIndex(raceIndex) {
  const url = "https://www.dnd5eapi.co/api/2014"

  try {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    const responseRace = await fetch(`${url}/races/${raceIndex}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseRace.ok) {
      throw new Error(`Response status: ${responseRace.status}\nURL: ${url}/races/${raceIndex}`);
    }

    console.log(
      `Race: ${raceIndex}\n`
    );

    const json = await responseRace.json();
    return json;

  }
  catch (err) {
    console.error(err);
    throw err;
  };
}

async function getAlignmentByIndex(alignmentIndex) {
  const url = "https://www.dnd5eapi.co/api/2014"

  try {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    const responseAlignment = await fetch(`${url}/alignments/${alignmentIndex}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseAlignment.ok) {
      throw new Error(`Response status: ${responseAlignment.status}\nURL: ${url}/alignments/${alignmentIndex}`);
    }

    console.log(
      `Race: ${alignmentIndex}\n`
    );

    const json = await responseAlignment.json();
    return json;
  }
  catch (err) {
    console.error(err);
    throw err;
  };
}

async function getClassByIndex(classIndex) {
  const url = "https://www.dnd5eapi.co/api/2014"

  try {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    const responseClass = await fetch(`${url}/classes/${classIndex}`, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    });

    if (!responseClass.ok) {
      throw new Error(`Response status: ${responseClass.status}\nURL: ${url}/classes/${classIndex}`);
    }

    console.log(
      `Race: ${classIndex}\n`
    );

    const json = await responseClass.json();
    return json;
  }
  catch (err) {
    console.error(err);
    throw err;
  };
}

generateRandomDnDCharacter();

module.exports = { races, classes, alignments, generateRandomDnDCharacter, getRaceByIndex, getClassByIndex, getAlignmentByIndex };
