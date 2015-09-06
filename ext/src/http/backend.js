var url = "http://elo-lasers.azurewebsites.net/";

var cacheDifficulties = {}; // cap?
var cacheSynonyms = {};
var REDACTED = "REDACTED";

//Public methods
function getDifficulties(words, callback) {
    fetchOrCache(words, fetchDifficulties, cacheDifficulties, callback);
}

function getSynonyms(words, callback) {
    fetchOrCache(words, fetchSynonyms, cacheSynonyms, callback);
}


//Private methods
function fetchDifficulties(words, callback) {
    $.post(url + "get_difficulties", {words: JSON.stringify(words)}, callback);
}

function fetchSynonyms(words, callback) {
    $.post(url + "get_synonyms", {words: JSON.stringify(words)}, callback);
}

function fetchOrCache(words, fetch, cache, callback) {
    var results = {};
    var wordsNeeded = [];
    $.each(words, function(idx, word) {
        if (cache[word] !== undefined) {
            results[word] = cache[word];
        }
        else {
            cache[word] = null;
            wordsNeeded.push(word);
        }
    });

    if(wordsNeeded.length > 0)
    {
        fetch(wordsNeeded, function(data) {
            $.each(data, function(word, value) {
                results[word] = value;
                cache[word] = value;
            });
            $.each(words, function(idx, word) {
                if(cache[word] === null) {
                    cache[word] = REDACTED;
                }
            });
            callback(results);
        });
    }
    else
    {
        callback(results);
    }
}

