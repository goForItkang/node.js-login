const express = require('express');
const router =express.Router();
const debug = require('debug')('app:login');
const pool = require('../config/mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// 암호화
// 복호화 개념


// 암호화 함수

// env 파일로 변환 작업 해야함
const KEY = crypto.randomBytes(32);
function encrypt(planText){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
    const encrypted = Buffer.concat([cipher.update(planText), cipher.final()]);
    return {
        iv : iv.toString('base64'),
        ciphertext : encrypted.toString('base64')
    }
}
// 복호화 함수
function decrypt({iv,encryptedText}){
    if(!iv || !encryptedText) return; // 받은 데이터가 없는 경우
    const ivBuffer = Buffer.from(iv,'base64');
    const encryptedTextBuffer = Buffer.from(encryptedText,'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', 'secretKey',ivBuffer);
    const decrypted = Buffer.concat([decipher.update(encryptedTextBuffer), decipher.final()]);
    return decrypted.toString();
}

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
router.post('/signup', async (req, res) => {
    const {email,password,name} = req.body;
    // 패스워드 해쉬 암호화
    const hashedPassword = await bcrypt.hash(password);
    const encodeEmail = encrypt(email);
    console.log('회원 가입 정보',req.body);

    await pool.query('insert into users(email,password,name,created_at) values(?,?,?,now())',[encodeEmail,hashedPassword,name])
    res.redirect('/login')
})
// 이메일 중복확인 로직
router.post('/duplicate', async (req, res)=>{
    const {email} = req.body;
    // 확인
    debug('dublicate email', email);
    // 만약 비어 있지 않고

    if(req.body != null) {
       const [rows] = await pool.query('select * from users where email = ?', [email]);
        debug('dublicate email', rows);
        if(rows.length > 0) {
            // 중복된 아이디가 있을경우
            return res.status(401).json(
                {available:false}
            )
        }else{
            return res.status(200).json(
                {available:true}
            )
        }
    }
})
module.exports = router;