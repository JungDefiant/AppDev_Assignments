function checkAccess(loggedIn) {
  /*
  accessLevel was changed to let because its value is reassigned later in the code.
  */
  let accessLevel;
  /*
  userRole was changed to let because its value is reassigned later in the code.
  */
  let userRole;
  if (loggedIn) {
    /*
    message was changed to const because its value does not change.
    */
    const message = "User is logged in.";
    console.log(message);
    if (userRole === "admin") {
      accessLevel = "full";
    } else {
      accessLevel = "limited";
    }
  } else {
    /*
    message was changed to const because its value does not change.
    */
    const message = "User not logged in.";
    console.log(message);
    accessLevel = "none";
  }
  return accessLevel;
}

/*
i was changed to let because it needs to be block-scoped and its value changes over time.
*/
for (let i = 0; i < 3; i++) {
  console.log("Attempt", i);
  /*
  loggedIn was changed to const because it needs to be block-scoped and its value is not reassigned
  */
  const loggedIn = Math.random() >= 0.5;
  checkAccess(loggedIn);
  console.log("Access Level:", checkAccess(loggedIn));
}

