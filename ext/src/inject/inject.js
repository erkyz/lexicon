$(document).ready(function() {
  $('head').append($('<link>')
    .attr("rel","stylesheet")
    .attr("type","text/css")
    .attr("href", chrome.extension.getURL('src/inject/inject.css')));
});

chrome.runtime.sendMessage({init:true}, function(response) {
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
      return word.toLowerCase().replace(/[^a-zA-Z'.]/g, " ").replace(/\.+$/, " ").trim();
    });

    uniqueWords = words.filter(function(item, pos) {
      return words.indexOf(item) == pos;
    });
    console.log(uniqueWords);
    chrome.runtime.sendMessage({getDifficulties:uniqueWords}, function(response) {
      console.log(response.toAdd);
      console.log(response.toRemove);
      for (var i = 0; i < response.toAdd.length; i++) {
        console.log(response.toAdd[i]);
        $('p').html(function(idx, oldHtml){
          console.log("old", oldHtml);
          var newHtml = oldHtml.replace(new RegExp( "( )(" + preg_quote( response.toAdd[i] ) + ")([ ?!,.:])" , 'gi' ), "$1<b class='highlighted'>$2</b>$3");
          console.log("new", newHtml);
          return newHtml;
        });
      }
      for (var i = 0; i < response.toRemove.length; i++) {
      $('body').unhighlight(response.toRemove[i]);

      }
    });

		// ----------------------------------------------------------
	}
	}, 10);
});

function preg_quote( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

/*
chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse) {
    if (request.addHighlight) {
      console.log (request.addHighlight);
      $('body').highlight(request.addHighlight);
    } else if (request.removeHighlight) {
      $('body').unhighlight(request.removeHighlight);
    }
  });
  */
