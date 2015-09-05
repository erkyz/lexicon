var url = "http://elo-lasers.herokuapp.com/";

function getDifficulties(words, callback) {
  $.post(url + "get_difficulties", {words: JSON.stringify(words)}, callback);
}
