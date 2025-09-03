var express = require('express');
var router = express.Router();
const pool = require('../config/mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hi yohan' });
});
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'login' });
})
router.get('/signup', async function(req, res, next) {
    const [rows] = await pool.query('select * from users');

    res.render('signup', { title: 'signup' , users:rows});
})

module.exports = router;
