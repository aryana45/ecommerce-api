import app from './app.js';
import config from './config/index.js';

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`App listening on server ${PORT}`);
});
