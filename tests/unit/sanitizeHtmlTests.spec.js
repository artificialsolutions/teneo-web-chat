import sanitizeHtml from '../../src/utils/sanitize-html.js';

describe('Sanitize HTML tests', () => {
        
    test('Leaves plain text unaltered', () => {
        const text = 'plain text string';
        expect(sanitizeHtml(text)).toBe(text);
    })

    it('Keeps allowed tags', () => {
        const text = 'this is <b>a</b> <strong>test</strong> text';
        expect(sanitizeHtml(text, { disallowedTags: [] })).toBe(text);
      });

    it('Removes <script> tags by default', () => {
        const text = 'a <script>console.log("hello there")</script> tag';
        expect(sanitizeHtml(text)).toBe('a  tag');
    });

    it('Removes <img> tags by default', () => {
        const text = 'an <img src="https://teneo.com/bot.jpg" /> tag';
        expect(sanitizeHtml(text)).toBe('an  tag');
    });

    it('Removes <iframe> tags by default', () => {
        const text = 'an <iframe src="https://teneo.com"></iframe> tag';
        expect(sanitizeHtml(text)).toBe('an  tag');
    });
    
    it('Removes <button> tags', () => {
        const text = 'a <button>button</button> tag';  
        expect(sanitizeHtml(text)).toBe('a  tag');
    });

    it('Removes <form> tags', () => {
        const text = 'a <form></form> tag';
        expect(sanitizeHtml(text)).toBe('a  tag');
    });

    it('Removes tags with event handlers', () => {
        const text = `<div>
        <p onclick="testFn()">on click</p><p>NO EVENT HANDLERS!</p></div>`.trim();

        const expectedText = `<div>
        <p>NO EVENT HANDLERS!</p></div>`.trim();
        expect(sanitizeHtml(text)).toBe(expectedText)
      });
})