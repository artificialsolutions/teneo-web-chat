const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 9000;
const teneoEngineUrl = process.env.TENEO_ENGINE_URL;

if (!teneoEngineUrl) {
  throw new Error('Missing environment variable TENEO_ENGINE_URL!');
}

app.use(express.static('./dist/'));

app.set('view engine', 'ejs');

app.get('/', (req, res) =>
  res.render(path.join(__dirname, './dist/index.html'), {
    TENEO_ENGINE_URL: teneoEngineUrl,
  })
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
