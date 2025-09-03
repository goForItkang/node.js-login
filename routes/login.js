const express = require('express');
const router =express.Router();
const debug = require('debug')('app:login');
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
router.post('/signup', (req, res) => {
    const {email,password} = req.body;
    console.log('회원 가입 정보',req.body);
    if(!email || !password ) {
        debug('username or password is required', req.body);
        return res.status(400).render('signup', {title:'signup',error:'username or password is required'});
    }
    res.redirect('/login')
})
module.exports = router;