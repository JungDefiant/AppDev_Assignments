function checkAccess(loggedIn) {
  /*

  */
  let accessLevel;
  /*

  */
  let userRole;
  if (loggedIn) {
    /*

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

    */
    const message = "User not logged in.";
    console.log(message);
    accessLevel = "none";
  }
  return accessLevel;
}

/*

*/
for (let i = 0; i < 3; i++) {
  console.log("Attempt", i);
  /*

  */
  const loggedIn = Math.random() >= 0.5;
  checkAccess(loggedIn);
  console.log("Access Level:", checkAccess(loggedIn));
}

