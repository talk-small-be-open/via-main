//
// VIA Javascript Library (Frontend & Backend)
//
// Remark: Try to be plain Javascript, since we defer load all the other libraries
// like jQuery etc., or be sure that those functions are not called early.
//

//
// Cookie consent
//
// See https://cookie-bar.eu or https://github.com/ToX82/cookie-bar
var cookiesAllowed = false;
function checkCookiesAllowed() {
	var matchedCookies = document.cookie.match(/(;)?cookiebar=([^;]*);?/);
	if ( matchedCookies && (matchedCookies[2] == 'CookieAllowed') ) {
		cookiesAllowed = true;
	}
}
function isCookiesAllowed() {
	return cookiesAllowed;
}
function isCookiesNotAllowed() {
	return !cookiesAllowed;
}
function setCookiesAllowed() {
	cookiesAllowed = true;
}
checkCookiesAllowed();


//
// Scroll position restoring
//
function saveScroll(id) {
	if (isCookiesNotAllowed()) { return }
	
	//var y = $(document).scrollTop();
	var y = window.pageYOffset || document.documentElement.scrollTop;

	// Short time to live, else they would cumulate to many in the browser
	var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
	Cookies.set("page_scroll_" + id, y, { expires: inFifteenMinutes, sameSite: "Strict", secure: true });
}

var isLoadScrollDone = false;
function loadScroll(id) {
	// Prevent multi-restore from many components
	if (isLoadScrollDone) { return }

	if (isCookiesNotAllowed()) { return }

	var y = Cookies.get("page_scroll_" + id);
	if (!y) {return}
	//$(document).scrollTop(y);
	//	document.documentElement.scrollTop = document.body.scrollTop = y;
	window.scroll({behavior: 'auto', top: y});
	
	isLoadScrollDone = true;
}


//
// General library
//

// Creates group of items whenever their value from borderChecker(item) changes
// Example: runningGroupArray(['aaa', 'aaa', 'eee', 'ww', 'tt', 'ttt', 'zzz'], function(item){return item.length})
// => [["aaa", "aaa", "eee"], ["ww", "tt"], ["ttt", "zzz"]]
function runningGroupArray(array, borderChecker) {
	var lastValue;
	var currentCollection;
	return _.reduce(array, function(output, item) {
		var thisValue = borderChecker(item);
		if (lastValue != thisValue) {
			lastValue = thisValue;
			currentCollection = [];
			output.push(currentCollection)
		}
		currentCollection.push(item);
		return output
	}, [])
}

// Marks the content text of an element. Used for copy/paste helper */
function selectTextIn(jQueryElements) {
	var range = document.createRange();
  var selection = window.getSelection();
  range.selectNodeContents(jQueryElements[0]);
  
  selection.removeAllRanges();
  selection.addRange(range);
}



// Warns the user, of the page is being unloaded. Only submit buttons are allowed to go to another page.
// Used for exams, to prevent data loss.
function enableUnloadWarning() {

	$(window).on('beforeunload', function (e) {
		// Cancel the event
		e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
		e.returnValue = '';
	});

	// Every submit button should be allowed to unload the page
	$('form').submit(function() {
		$(window).off('beforeunload');
	});
}


//
// LAZY Images
//

var lazy = [];

function setLazy(){
  lazy = document.querySelectorAll('img.lazy');
} 

function lazyLoad(){
  for(var i=0; i<lazy.length; i++){
		var img = lazy[i];
    if(isInViewport(img)){
      if (img.getAttribute('data-src')){
				
				img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');

				let event = new Event("lazyLoaded", {
					bubbles: false
				});
				img.dispatchEvent(event);

      }
    }
  }
  
  cleanLazy();
}

// Schneller filter
function cleanLazy(){
  lazy = Array.prototype.filter.call(lazy, function(l){ return l.getAttribute('data-src');});
}

// OPTIMIZE: Abfrage auch auf visible? Schwierig: Reagieren auf, wenn eingeblendet
function isInViewport(el){
  var rect = el.getBoundingClientRect();
  
  return (
    rect.bottom >= 0 && 
      rect.right >= 0 && 
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}






// Wrap a timer around another promise
function promiseTimeout(ms, promise){

  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in '+ ms + 'ms.')
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}

// Event debouncing. For stuff, which should not be done to fast repeatedly.
// execAsap = true: execute immediately once and then never again if retriggered inside thresholdMs
// execAsap = false: execute only after all retriggers are done inside thresholdMs
function debounce(func, thresholdMs, execAsap) {
  var timeout;

  return function debounced () {

    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) func.apply(obj, args);
      timeout = null;
    };

    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);

    timeout = setTimeout(delayed, thresholdMs || 100);
  };
}


function handleSessionCheck(responseData) {
	var msg;
	
	switch (responseData) {
	case 'OK':
		// alert('Session OK');
	  break;
	case 'expired':
		msg = $("#expiredSessionMessage").text();
		alert(msg);
		location.reload(true);
		break;
	case 'nearlyExpired':
		msg = $("#nearlyExpiredSessionMessage").text();
		alert(msg);
		// OPTIMIZE: Send keepalive here
		break;
	default:
		// nothing
	}
	
}

function preventBackButton(thenCallback) {
	// Hacky method to prevent back button
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function() {
    window.history.pushState(null, "", window.location.href);
		// or? this.props.history.go(1); see also https://subwaymatch.medium.com/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7
		
		if (thenCallback) {
			thenCallback();
		}
  }

}

// removes all special accents on the characters
function normalizeString(inString) {
	return inString.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
