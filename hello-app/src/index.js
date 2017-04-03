const { createServer } = require('restify');

const server = createServer();

server.get('/', (req, res, next) => {
  res.send('Hello world!!!');
  next();
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
