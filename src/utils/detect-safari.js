export default function detectSafari(){
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);;
}