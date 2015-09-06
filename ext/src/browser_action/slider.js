var difficulty;
var slider = $('input[type="range"]')[0];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.newDifficulty) {
			difficulty = request.newDifficulty;
			slider.value = difficulty;
		}
	});

chrome.runtime.sendMessage({getDifficulty:true}, function(response) {
	if (response !== undefined) {
		difficulty = response;
		slider.value = difficulty;
	}
});

console.log(difficulty);
$('input[type="range"]').change(function() {
	// undfined means we are still trying to retrieve difficulty from
	// background
		console.log("value : " + this.value);
		console.log("difficulty : " + difficulty);
	if (difficulty != undefined) {
		difficulty = parseInt(this.value);
		chrome.runtime.sendMessage({newDifficulty:this.value});
	}
});
