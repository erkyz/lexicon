var difficulty;

function getDifficulty() {
	chrome.storage.local.get("difficulty", function(items) {
		if (!chrome.runtime.error) {
			console.log(items);
			if (items.difficulty == undefined) {
				console.log("retrieved undefined difficulty");
				difficulty = 50;
			} else {
				difficulty = items.difficulty;
				console.log("retrieved difficulty of " + difficulty);
			}
			var slider = $('input[type="range"]')[0];
			slider.value = difficulty;
			sendDifficulty();
		} else {
			console.log("store difficulty error");
		}
	});
}

function sendDifficulty() {
	chrome.storage.local.set({"difficulty" : difficulty}, function() {
		if (chrome.runtime.error) {
			console.log("store difficulty error");
		} else {
			console.log("stored successful");
			console.log(difficulty);
		}
	});
	chrome.runtime.sendMessage({newDifficulty : difficulty});
}

getDifficulty();

$('input[type="range"]').change(function() {
	// undfined means we are still trying to retrieve difficulty from storage
	if (difficulty != undefined) {
		console.log("value : " + this.value);
		difficulty = this.value;
		sendDifficulty();
	}
});

