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
    req.body.mapper = 'ManageMapper';//mybatis xml 파일명

    try {

    if(type == 'category'){
        //카테고리 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectCategoryList';
    }else if(type == "addCategory"){
        req.body.crud = 'insert';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'insertCategory';
    }else if(type == 'list'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectPostList';
    }else if(type == "addPost"){
        req.body.crud = 'insert';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'insertPost';
    }else if(type == "modifyPost"){
        req.body.crud = 'update';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'updatePost';
    }else if(type == "deletePost"){
        req.body.crud = 'delete';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'deletePost';
    }else if(type == 'blog'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectBlog';
    }else if(type == 'editBlog'){
        //최신 리스트 조회
        req.body.crud = 'update';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'updateBlog';
    }else if(type == 'profile'){
        //최신 리스트 조회
        req.body.crud = 'select';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'selectProfile';
    }else if(type == 'editProfile'){
        //최신 리스트 조회
        req.body.crud = 'update';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'updateProfile';
    }else if(type == 'deleteCategory'){
        //최신 리스트 조회
        req.body.crud = 'delete';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'deleteCategory';
    }else if(type == 'modifyCategory'){
        //최신 리스트 조회
        req.body.crud = 'update';//select, insert, update, delete 중에 입력
        req.body.mapper_id = 'updateCategory';
    }

    router.use('/', dbconnect_Module);
    next('route');

    } catch (error) {
        console.log("Module > dbconnect error : "+ error);      
    }
});

module.exports = router;