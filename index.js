const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const methodOverride = require('method-override');
const request = require('request');
const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
const Board = require('./models/board');
const Reply = require('./models/reply');
const mongoose = require('mongoose');
const ejs = require('ejs');
const util = require('./utils');
const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb://admin:asdasd12@ds151753.mlab.com:51753/crwal',
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', callbak => {
  console.log('db connection success');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 7001);

const rule = new schedule.RecurrenceRule();
const date = new Date();

rule.minute = 1;

app.get('/list', (req, res) => {
  Board.find({}, 'tit cont author createdAt', (err, boards) => {
    if (err) console.log(err);
    res.render('list', { boards, today: util.getDate(date) });
  }).sort('-createdAt');
});

app.get('/view/:id', (req, res) => {
  Board.findOne(
    {
      _id: req.params.id
    },
    'tit author cont reply',
    (err, board) => {
      if (err) {
        console.log(err);
      }
      res.render('view', { board, id: req.params.id });
    }
  );
});

app.post('/view/:id', (req, res) => {
  const date = new Date();
  const replyCont = {
    name: req.body.name,
    password: req.body.password,
    content: req.body.content,
    regdate: util.getDate2(date)
  };
  Board.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $push: {
        reply: replyCont
      }
    },
    success => {      
      res.redirect(req.get('referer'));
    }
  );
});

schedule.scheduleJob('*/1 * * * *', () => {
  const opts = {
    url:'https://media.daum.net/economic', 
    link: '.list_mainnews a.link_txt', 
    title :'.tit_view',
    content:'.news_view'
  }

  crwal(opts);
});


const crwal = async opts => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let tempArr = [];
  let tempObj = {};
  await page.goto(opts.url);
  await page.waitForSelector(opts.link);
  const stories = await page.$$eval(opts.link, anchors => {
    return anchors.map(anchor => anchor.href).slice(0, 10);
  });

  for (let storyLink of stories) {
    await page.goto(storyLink);
    const tit = await page.$eval(opts.title, element => {
      return element.innerHTML;
    });

    const cont = await page.$eval(opts.content, element => {
      return element.innerHTML;
    });
    tempObj.tit = tit;
    tempObj.cont = cont;
    tempArr.push(tempObj);

    writeBoard(tit, cont);
  }

  await browser.close();
};

const writeBoard = (tit, cont) => {
  Board.find({ tit: tit }, (err, board, result) => {
    const new_contents = new Board({ tit, cont });
    new_contents.save(err => {
      err ? console.log(err) : console.log('success');
    });
  });
};
