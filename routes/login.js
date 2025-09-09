require('dotenv').config();
const express = require('express');
const router =express.Router();
const debug = require('debug')('app:login');
const pool = require('../config/mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
//  env 파일 가져오기
// 암호화
// 복호화 개념

const rawB64 = (process.env.SECRET_KEY || '').trim();
if (!rawB64) {
    throw new Error('SECRET_KEY_BASE64가 없습니다. 32바이트 키를 base64로 설정하세요.');
}
const KEY = Buffer.from(rawB64, 'base64');
if (KEY.length !== 32) {
    throw new Error('SECRET_KEY_BASE64 디코딩 결과가 32바이트가 아닙니다(AES-256).');
}

function encode(planText){
    // iv 값 생성
    const iv = crypto.randomBytes(16); // 랜덤값 생성
    // chiper 생성
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);

    const encryted = Buffer.concat([cipher.update(planText,'utf8'), cipher.final()]);

    // return 값 반환
    return {
        iv : iv.toString('base64'),
        encryptedText : encryted.toString('base64')
    }
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
    debug('signup email', encode(email)); // 암호화 진행한 encode 암호화


    // await pool.query('insert into users(email,password,name,created_at) values(?,?,?,now())',[encodeEmail,hashedPassword,name])
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