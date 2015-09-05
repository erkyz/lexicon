// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var currentDifficulty = 50;
var difficulties = {}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      console.log(request.getDifficulties);
      getDifficulties(request.getDifficulties, function(data) {
        for (var attrname in data) { difficulties[attrname] = data[attrname]; }
        console.log(difficulties);
      });

    } else if (request.newDifficulty) {
      if (request.newDifficulty > currentDifficulty) {
        $.each(difficulties, function(word,wordDifficulty) {
          if (wordDifficulty > currentDifficulty)
			#("body").highlight(word);
        });
      } else if (request.newDifficulty < currentDifficulty) {
          $.each(difficulties, function(word,difficulty) {
            if (difficulty > currentDifficulty)
				#("body").removeHighlight(word);
          });
      }
    } else {
		sendResponse();
	}
  });

<style>
.highlight {
	background-color:"yellow";
}
</style>


// TODO openPopup
