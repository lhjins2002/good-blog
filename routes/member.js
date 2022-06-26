var express = require('express');

var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;

let jwt = require("jsonwebtoken");
let secretObj = require("../ignorefile/jwt");

router.post('/', (req, res, next) => {
    var type = req.query.type;

    // Mysql Api 모듈(CRUD)
    var dbconnect_Module = require('./dbconnect_Module');

    //Mysql 쿼리 호출 정보 입력
    req.body.mapper = 'MemberMapper';//mybatis xml 파일명

    try {

        if(type == 'signup'){
            //회원가입
            req.body.crud = 'insert';//select, insert, update, delete 중에 입력
            req.body.mapper_id = 'insertMember';
            req.body.blog_name = req.body.user_name + "님의 블로그";

            var myPlaintextPassword = req.body.user_password;
            if(myPlaintextPassword != '' && myPlaintextPassword != undefined){
                bcrypt.genSalt(saltRounds, function(err, salt){
                    bcrypt.hash(myPlaintextPassword, salt, function(err, hash){
                        req.body.user_password = hash;
                        
                        router.use('/', dbconnect_Module);
                        next('route');
                    });
                });
            }

        }else if(type == 'login'){
            //최신 리스트 조회
            req.body.crud = 'select';//select, insert, update, delete 중에 입력
            req.body.mapper_id = 'selectLoginCheck';

            router.use('/', dbconnect_Module);
            next('route');

        }else if(type == "SessionState"){
            var user_id = req.body.user_id
            var user_name = req.body.user_name
            try {
            let token1 = jwt.sign(
            { id: user_id },
            secretObj.secret,
            { expiresIn: '60m' })
            
            let token2 = jwt.sign(
            { name: user_name },
            secretObj.secret,
            { expiresIn: '60m' })

            res.send({"token1":token1, "token2":token2});
            } catch (error) {
            res.send(error)
            }
        }else if(type == "SessionConfirm"){
            try {
            let token1 = req.body.token1;
            let token2 = req.body.token2;
            
            if(token1 != undefined && token1 != '' & token2 != undefined && token2 != ''){
                let decoded1 = jwt.verify(token1, secretObj.secret);
                let decoded2 = jwt.verify(token2, secretObj.secret);
                res.send({"token1":decoded1.id, "token2":decoded2.name});
            }else{
                res.send({"token1":"", "token2":""});
            }
            } catch (error) {
            res.send(error)
            }
        }else if(type == "SessionSignin"){
            // 쿠키 정보로 사용자 인증 
            try {
              // Mysql Api 모듈(CRUD)
              var dbconnect_Module = require('./dbconnect_Module');
              //Mysql 쿼리 호출정보 입력
              req.body.mapper = 'UserMapper';//mybatis xml 파일명
              req.body.crud = 'select';//select, insert, update, delete 중에 입력
              req.body.mapper_id = 'selectSessionLoginCheck';
          
              router.use('/', dbconnect_Module);
              next('route')
              
            } catch (error) {
              console.log("Module > dbconnect error : "+ error);      
            }
        }

    } catch (error) {
        console.log("Module > dbconnect error : "+ error);      
    }
});

module.exports = router;