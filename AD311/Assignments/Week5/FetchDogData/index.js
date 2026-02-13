async function getDogData() {
  try
  {
    const response = await fetch("https://dogapi.dog/api/v2/breeds", {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("========= GET DOG DATA =========\n");
    console.log(result);

    return result;
  }
  catch(err)
  {
    console.error(err);
    throw err;
  };
}

async function getDogDataById(id) {
  try
  {
    const response = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("========= GET DOG DATA BY ID =========\n");
    console.log(result);

    return result;
  }
  catch(err)
  {
    console.error(err);
    throw err;
  };
}

async function getDogFacts() {
  try
  {
    const response = await fetch(`https://dogapi.dog/api/v2/facts`, {
      method: "GET"
    });
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("========= GET DOG FACTS =========\n");
    console.log(result);

    return result;
  }
  catch(err)
  {
    console.error(err);
    throw err;
  };
}

async function getDogGroups() {
  try
  {
    const response = await fetch(`https://dogapi.dog/api/v2/groups`, {
      method: "GET"
    });
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("========= GET DOG GROUPS =========\n");
    console.log(result);

    return result;
  }
  catch(err)
  {
    console.error(err);
    throw err;
  };
}

getDogData();
getDogDataById("5462fedb-7f80-49c5-98c3-8ce3207e7d03");
getDogFacts();
getDogGroups();

module.exports = { getDogData, getDogDataById, getDogFacts, getDogGroups };
