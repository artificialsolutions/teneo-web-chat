import sanitizeHtml from '../../../src/utils/sanitize-html.js';

describe('sanitizeHtml', () => {
  it('leaves plain text unaltered', () => {
    const text = 'plain text string';

    expect(sanitizeHtml(text)).to.eql(text);
  });

  it('keeps allowed tags', () => {
    const text = 'this is <b>a</b> <strong>test</strong> text';

    expect(sanitizeHtml(text, { disallowedTags: [] })).to.eql(text);
  });

  it('removes <script> tags by default', () => {
    const text = 'a <script>console.log("hello there")</script> tag';

    expect(sanitizeHtml(text)).to.eql('a  tag');
  });

  it('removes <img> tags by default', () => {
    const text = 'an <img src="https://teneo.com/bot.jpg" /> tag';

    expect(sanitizeHtml(text)).to.eql('an  tag');
  });

  it('removes <iframe> tags by default', () => {
    const text = 'an <iframe src="https://teneo.com"></iframe> tag';

    expect(sanitizeHtml(text)).to.eql('an  tag');
  });

  it('removes <iframe> tags by default', () => {
    const text = 'an <iframe src="https://teneo.com"></iframe> tag';

    expect(sanitizeHtml(text)).to.eql('an  tag');
  });

  it('removes <button> tags', () => {
    const text = 'a <button>button</button> tag';

    expect(sanitizeHtml(text)).to.eql('a  tag');
  });

  it('removes <form> tags', () => {
    const text = 'a <form></form> tag';

    expect(sanitizeHtml(text)).to.eql('a  tag');
  });

  it('removes tags with event handlers', () => {
    const text = `
<div>
  <p onclick="testFn()">on click</p>
  <p onabort="testFn()">on abort</p>
  <p onblur="testFn()">on blur</p>
  <p>NO EVENT HANDLERS!</p>
</div>
`.trim();

    expect(sanitizeHtml(text).replace(/^\s+$/gim, '')).to.eql(
      `
<div>

  <p>NO EVENT HANDLERS!</p>
</div>`.trim()
    );
  });
});
