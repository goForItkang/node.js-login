const express = require('express');
const router =express.Router();
const debug = require('debug')('app:login');
const pool = require('../config/mysql');
// login post
router.post('/login', (req, res) => {
    const {email,password} = req.body;
    console.log("로그인 정보",req.body);
    if(!email || !password ) {
        debug('username or password is required', req.body);
        return res.status(400).render('login', {title:'login',error:'username or password is required'});
    }else{
        return res.redirect('/');
    }
});
// 회원 가입 로직
//
router.post('/signup', async (req, res) => {
    const {email,password,name} = req.body;
    console.log('회원 가입 정보',req.body);
    await pool.query('insert into users(email,password,name,created_at) values(?,?,?,now())',[email,password,name])
    res.redirect('/login')
})
module.exports = router;