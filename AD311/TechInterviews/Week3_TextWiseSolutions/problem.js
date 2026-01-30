function recursiveStringReversal(oldStr, newStr = "") {
  lastChar = oldStr.slice(-1);
  newStr = newStr.concat(lastChar);
  oldStr = oldStr.slice(0, -1);
  
  if(!oldStr || oldStr === "")
  {
    console.log(newStr);
    return newStr;
  }
  else
  {
    return recursiveStringReversal(oldStr, newStr);
  }
}

module.exports = recursiveStringReversal;
