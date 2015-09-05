// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

difficulties = {}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      console.log(request.getDifficulties);
      getDifficulties(request.getDifficulties,onReceivedDifficulties);
    } else if request.newDifficulty {
      console.log(request.newDifficulty);
    }
    sendResponse();
  });

function onReceivedDifficulties(res) {
  console.log(res);
  jQuery.extend(difficulties,res);
  chrome.runtime.sendMessage({openPopup:true});
}
