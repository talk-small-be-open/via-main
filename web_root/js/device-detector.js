// JavaScript Browser detection (intentionally not using navigator.userAgent, can be faked)
// Credit: https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser

const ua = navigator.userAgent;

// Opera 8.0+
const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || ua.indexOf(' OPR/') >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Edge (based on chromium) detection
const isEdgeChromium = isChrome && (ua.indexOf("Edg") != -1);

// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS;

const isIos = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
const isWebkit = !!ua.match(/WebKit/i);
const isIosSafari = isIos && isWebkit && !ua.match(/CriOS/i);

var detectedBrowser = 'unknown';
if (isOpera) { detectedBrowser = 'Opera' }
if (isFirefox) { detectedBrowser = 'Firefox' }
if (isSafari) { detectedBrowser = 'Safari' }
if (isIE) { detectedBrowser = 'IE' }
if (isEdge) { detectedBrowser = 'Edge' }
if (isChrome) { detectedBrowser = 'Chrome' }
if (isEdgeChromium) { detectedBrowser = 'EdgeChromium' }
if (isBlink) { detectedBrowser = 'Blink' }

if (isIosSafari) { detectedBrowser = 'iOSSafari' }

// Could also be tested on browser, minimal-ui, fullscreen, ... see also webmanifest
const isPwaStandalone = (window.matchMedia('(display-mode: standalone)').matches);
const isPwaFullscreen = (window.matchMedia('(display-mode: fullscreen)').matches);
const isPwa = isPwaStandalone || isPwaFullscreen;
