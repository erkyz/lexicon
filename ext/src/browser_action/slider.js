$('input[type="range"]').change(function() {
	chrome.runtime.sendMessage({newDifficulty : this.value});
});
