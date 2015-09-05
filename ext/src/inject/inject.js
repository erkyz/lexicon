
chrome.runtime.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading

    /*
    function getText(target) {
      var wordArr = [];
        $('*',target).add(target).find(":not(iframe):not(script):not(style)").each(function(k,v) {
          var words  = $('*',v.cloneNode(true)).remove().end().text().split(/(\s+|\n)/);
          wordArr = wordArr.concat(words.filter(function(n){return n.trim()}));
        });
        return wordArr;
    }

    var text = getText("body");
    words = $.map(words, function(word) {
      return word.toLowerCase();
    });
    */

    text = "";
    var getTextNodesIn = function(el) {
      return $(el).find(":not(iframe):not(script):not(style)").contents().filter(function() {
        // return (this.childNodes.length > 0 && this.childNodes[0].nodeType == 3);
        return this.nodeType == 1 && this.childNodes.length > 0;
      });
    };
    words = getTextNodesIn("body");
    for (var i = 0; i < words.length; i++) {
      for (var j = 0; j < words[i].childNodes.length; j++) {
        console.log(words[i].tagName);
        if (words[i].childNodes[j].nodeType == 3 && words[i].innerText.indexOf(words[i].childNodes[j].textContent) != -1 && words[i].tagName != "NOSCRIPT") {
          console.log(words[i].childNodes[j]);
          text = text + words[i].childNodes[j].textContent + " ";
        }
      }
    }
    text = text.replace(/[^a-zA-Z]/g, " ");
    words = text.split(/\s+/);
    console.log(words);
    uniqueWords = words.filter(function(item, pos) {
      return words.indexOf(item) == pos;
    });
    console.log(uniqueWords);
    chrome.runtime.sendMessage({getDifficulties:uniqueWords}, function(response) {
      console.log(response);
    });
		// ----------------------------------------------------------
	}
	}, 10);
});
