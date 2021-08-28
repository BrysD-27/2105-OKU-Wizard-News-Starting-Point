const express = require("express");
const morgan = require('morgan');
const postBank = require('./postBank');

const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <a href="/posts/${post.id}">▲${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  res.send(html);
      
})

  app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = postBank.find(id);

    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
          <div class='news-item'>
            <p>
              <span class='news-position'></span>${post.title}
              <small>(by ${post.name})</small>
            </p>
            <span class='news-position'><small>${post.date}</small></span>
            <br></br>
            ${post.content}            
      </div>
    </body>
    </html>`

    if(!post.id) {
      const err = `Doesn't Exist`
      errorHandler(err, req, res);
    } else {
      res.send(html);
    }
});

  function errorHandler (err, req, res, next) {
    res.status(400).end();
    res.render('Not Found');
  }

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
