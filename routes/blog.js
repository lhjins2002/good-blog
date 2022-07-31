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
    }else if(type == 'listbycategory'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectPostListByCategory';
    }else if(type == 'view'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectPostView';
    }else if(type == "bloginfo"){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectBlogInfo';
    }else if(type == "profileinfo"){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectProfileInfo';
    }else if(type == "categoryName"){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectCategoryName';
    }else if(type == "addComment"){
        req.body.crud = 'insert';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'insertComment';
    }else if(type == "commentList"){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectCommentList';
    }else if(type == 'commentCount'){
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectCommentCount';
    }else if(type == 'deleteComment'){
        req.body.crud = 'delete';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'deleteComment';
    }else if(type == 'updatePostHit'){
        req.body.crud = 'update';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'updatePostHit';
    }

    router.use('/', dbconnect_Module);
    next('route');

    } catch (error) {
        console.log("Module > dbconnect error : "+ error);      
    }
});

module.exports = router;