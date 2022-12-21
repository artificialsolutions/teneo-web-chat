const DISALLOWED_TAGS = ['script', 'img', 'iframe', 'frame', 'button', 'form'];
const EVENT_HANDLERS = /(onabort|onanimationcancel|onanimationend|onanimationiteration|onanimationstart|onauxclick|onblur|onerror|onfocus|oncancel|oncanplay|oncanplaythrough|onchange|onclick|onclose|oncontextmenu|oncuechange|ondblclick|ondrag|ondragend|ondragenter|ondragexit|ondragleave|ondragover|ondragstart|ondrop|ondurationchange|onemptied|onended|ongotpointercapture|oninput|oninvalid|onkeydown|onkeypress|onkeyup|onload|onloadeddata|onloadedmetadata|onloadend|onloadstart|onlostpointercapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmouseout|onmouseover|onmouseup|onmousewheel|onwheel|onpause|onplay|onplaying|onpointerdown|onpointermove|onpointerup|onpointercancel|onpointerover|onpointerout|onpointerenter|onpointerleave|onpointerlockchange|onpointerlockerror|onprogress|onratechange|onreset|onresize|onscroll|onseeked|onseeking|onselect|onselectstart|onselectionchange|onshow|onsort|onstalled|onsubmit|onsuspend|ontimeupdate|onvolumechange|ontouchcancel|ontouchend|ontouchmove|ontouchstart|ontransitioncancel|ontransitionend|onwaiting)=/gim;

export default function sanitizeHtml(htmlString, options = {}) {
  const disallowedTags = options.disallowedTags || DISALLOWED_TAGS;

  const root = document.createElement('div');

  root.innerHTML = htmlString;

  disallowedTags.forEach((disallowedTag) => {
    const toBeRemoved = root.getElementsByTagName(disallowedTag);

    Array.from(toBeRemoved).forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
  });

  const eventHandlerMatches = htmlString.match(EVENT_HANDLERS);

  if (eventHandlerMatches) {
    // Remove trailing equal sign
    const handlers = eventHandlerMatches.map((h) => h.replace('=', ''));

    handlers.forEach((handler) => {
      const elems = root.querySelectorAll(`[${handler}]`);

      Array.from(elems).forEach((elem) => {
        elem.parentNode.removeChild(elem);
      });
    });
  }

  return root.innerHTML;
}
