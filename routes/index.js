var express = require('express');
var yahooFinance = require('yahoo-finance');
var router = express.Router();
require('../utilities/utility')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.symbols = req.session.symbols
  if (req.session.symbols ) {
      var symbols = req.session.symbols
      res.render('index', { title: 'Express', items: symbols});

  }else{
      res.render('index', { title: 'Express' });
  }

});

router.get('/symbols/:symbols', function (req, res, next) {
  var symbols = req.params.symbols.split(',')
    yahooFinance.historical({
        symbols: symbols,
        from: (new Date()).addDays(-365),
        to: new Date(),
        // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
        let array = []
        symbols.forEach((item) => {
            let arr = {}
            arr.name = item
            arr.data = quotes[item].map(it => [it.date.getTime(), it.open])
            array.push(arr)
        })
        res.end(JSON.stringify(array))
    });
})

router.get('/symbol/:symbol', function (req, res, next) {
    //save session
    var sess = req.session.symbols || []
    sess.push(req.params.symbol)
    sess = sess.filter((item, pos) => {
        return sess.indexOf(item) == pos
    })
    req.session.symbols = sess
    res.locals.symbols = sess
    req.session.save()

    yahooFinance.historical({
        symbol: req.params.symbol,
        from: (new Date()).addDays(-365),
        to: new Date(),
        // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
        res.end(JSON.stringify(quotes.map(it => [it.date.getTime(), it.open])))
    });
})

router.get('/remove/:data', function (req, res, next) {
    //save session
    var sess = req.session.symbols || []
    sess.splice(sess.indexOf(req.params.data), 1)
    req.session.symbols = sess
    res.locals.symbols = sess
    req.session.save()
})

module.exports = router;
