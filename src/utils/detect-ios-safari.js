export default function detectIosSafari(){
    var ua = window.navigator.userAgent;
    var iOS = !ua.match(/iPad/i) && !!ua.match(/iPhone/i); // Note: we exclude iPad!
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/OPiOS/i);
    return iOSSafari;
}