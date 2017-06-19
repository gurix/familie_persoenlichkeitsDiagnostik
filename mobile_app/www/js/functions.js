/**
* Generates a "unique" id that is used to have a local object id
*/
makeid = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i=0; i < (length || 8); i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
* Shuffles an array randomly
*/
shuffle = function(array) {
  var counter = array.length, temp, index;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};
