var url = "http://elo-lasers.azurewebsites.net/";

function getDifficulties(words, callback) {
  $.post(url + "get_difficulties", {words: JSON.stringify(words)}, callback);
}
