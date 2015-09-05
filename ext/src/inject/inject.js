chrome.runtime.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
    text = $("body").text().replace(/[^a-zA-Z]/g, " ");
    words = text.split(/\s+/);
   
    uniqueWords = words.filter(function(item, pos) {
      return words.indexOf(item) == pos;
    });
    chrome.runtime.sendMessage({getDifficulties:uniqueWords});
		// ----------------------------------------------------------
	}
	}, 10);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.highlight) {
      $(body).replace(request.highlight, "<span id='highlight'>" + request.highlight + "</span>");
    }
  });
