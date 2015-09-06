$(document).ready(function() {
  $('head').append($('<link>')
    .attr("rel","stylesheet")
    .attr("type","text/css")
    .attr("href", chrome.extension.getURL('src/inject/inject.css')));
});

var myWords = [];
var myDifficulty = 40;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.highlightUpdate) {
			handleWordHighlightUpdate(request.highlightUpdate);
		} else if (request.updatedPageDifficulty && myWords !== undefined) {
			console.log("updated page difficulty");
			console.log(request.updatedPageDifficulty);
			sendResponse({"pageWords" : myWords,
					  "newDifficulty" : request.updatedPageDifficulty,
					  "oldDifficulty" : myDifficulty});
			myDifficulty = request.updatedPageDifficulty;
		}
		return true;
	});

function cleanWord(word) {
    return word.toLowerCase().replace(/[^a-zA-Z'.]/g, " ").replace(/\.+$/, " ").trim();
}
    
chrome.runtime.sendMessage({init:true}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

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
      return cleanWord(word);
    });

    uniqueWords = words.filter(function(item, pos) {
      return words.indexOf(item) == pos;
    });
	 myWords = uniqueWords;
    console.log(uniqueWords);
    chrome.runtime.sendMessage({getDifficulties:uniqueWords}, handleWordHighlightUpdate);
	}
	}, 10);
});

function handleWordHighlightUpdate(response) {
	 var highlights = response.highlights;
	 console.log("highlights " + highlights);
	 var synonyms = response.synonyms;
   	  console.log("to add:", highlights.toAdd);
      console.log("to remove:", highlights.toRemove);
      highlights.toAdd.sort();
      highlights.toRemove.sort();
      $('p').each(function(idx,elem){
        var that = this;
        setTimeout(function(){
            var oldHtml = $(that).html();
            var newHtml = oldHtml;
            oldHtml = oldHtml.toLowerCase().replace(/[^a-zA-Z'.]/gi, " ").replace(/\.+$/, " ").trim().split(" ");
            oldHtml.filter(function(item, pos) {
              return oldHtml.indexOf(item) == pos;
            }).filter(function(s) {
              return s != "";
            }).forEach(function(word) {
            
              var addIndex = highlights.toAdd.binaryIndexOf(word);
              if (addIndex >= 0) {
                var word = highlights.toAdd[addIndex];
                console.log("to highlight:", word);
                var replaceWith = "<b class='highlighted'><b class='word'>$1</b> (" + synonyms[word] + ")</b>$2";
                if(!synonyms[word]) {
                    replaceWith = "<b class='highlighted'><b class='word'>$1</b></b>$2";
                }
                newHtml = newHtml.replace(new RegExp( "(" + preg_quote( word ) + ")([ ?!,.:])" , 'gi' ), replaceWith);
              }
            });
            $(that).html(newHtml);
        }, 1);

    });
    $(".highlighted").each(function(idx, element) {
        var word = $(this).find(".word").text();
        var removeIndex  = highlights.toRemove.binaryIndexOf(cleanWord(word));
        if (removeIndex >= 0) {
            $(this).replaceWith(word);
        }
    });
}


/** from oli.me.uk
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOf(searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];

        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return -1;
}
Array.prototype.binaryIndexOf = binaryIndexOf;

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

// Create popup on document
var popupDOM = document.createElement('div');
popupDOM.setAttribute('class', 'selection_popup');
document.body.appendChild(popupDOM);

function renderPopup(pageX, pageY, selection) {
  popupDOM.innerHTML = selection;
  popupDOM.style.top = pageY + 'px';
  popupDOM.style.left = pageX + 'px';
  popupDOM.style.visibility = 'visible';
}

document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  var definition;
  chrome.runtime.sendMessage({getDefinitions: [selection]}, function(response) {
    if (selection.length > 0) {
      definition = response.definitions[selection];
      renderPopup(e.pageX, e.pageY, definition);
    }
  });
});

// close popup on another click
document.addEventListener('mousedown', function (e) {
  popupDOM.style.visibility = 'hidden';
});
