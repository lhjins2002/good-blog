var express = require('express');

var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res, next) => {
    var type = req.query.type;

    // Mysql Api 모듈(CRUD)
    var dbconnect_Module = require('./dbconnect_Module');

    //Mysql 쿼리 호출 정보 입력
    req.body.mapper = 'BlogMapper';//mybatis xml 파일명

    try {

    if(type == 'category'){
        //카테고리 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectCategoryList';
    }else if(type == 'list'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectPostList';
    }else if(type == 'view'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectPostView';
    }else if(type == "bloginfo"){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectBlogInfo';
    }

    router.use('/', dbconnect_Module);
    next('route');

    } catch (error) {
        console.log("Module > dbconnect error : "+ error);      
    }
});

module.exports = router;