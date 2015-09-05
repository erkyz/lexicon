
chrome.runtime.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
    text = "";
    var getTextNodesIn = function(el) {
      return $(el).find(":not(iframe):not(script):not(style)").contents().filter(function() {
        return this.nodeType == 1 && this.childNodes.length > 0;
      });
    };
    words = getTextNodesIn("body");
    for (var i = 0; i < words.length; i++) {
      for (var j = 0; j < words[i].childNodes.length; j++) {
        if (words[i].childNodes[j].nodeType == 3 /* && words[i].innerText.indexOf(words[i].childNodes[j].textContent) != -1 */ && words[i].tagName != "NOSCRIPT" && words[i].tagName != "SCRIPT" && words[i].tagName != "STYLE") {
          text = text + words[i].childNodes[j].textContent + " ";
        }
      }
    }
    words = text.split(/\s+/);
    words = $.map(words, function(word) {
      return word.toLowerCase().replace(/[^a-zA-Z'.]/g, " ").replace(/\.$/, " ").trim();
    });
   
    uniqueWords = words.filter(function(item, pos) {
      return words.indexOf(item) == pos;
    });
    console.log(uniqueWords);
    chrome.runtime.sendMessage({getDifficulties:uniqueWords}, highlightWords);
		// ----------------------------------------------------------
	}
	}, 10);
});

function highlightWords(difficulty, words) {

}

