const puppeteer = require('puppeteer');
const getDate = dateObj => {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate())
    );
};

const get2digits = num => {
  return ('0' + num).slice(-2);
};

const getDate2 = dateObj => {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate()) +
      ' ' +
      get2digits(dateObj.getHours()) +
      ':' +
      get2digits(dateObj.getMinutes())
    );
};


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

module.exports = {
  getDate,
  getDate2,
  crwal,
};
