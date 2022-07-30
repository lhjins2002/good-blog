import * as React from 'react';
import Box from '@mui/material/Box';
import cookie from 'react-cookies';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import Avatar from '@mui/joy/Avatar';
import { CssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useParams } from "react-router";
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BlogComment() {

  //커스텀 테마
  const theme = createTheme({
    palette: {
      primary: {
        main: "#183F48",
      },
    },
  });

  const navigate = useNavigate();

  let { post_id } = useParams();

  //state 변수 선언
  const [auth, setAuth] = React.useState(false);              //로그인 여부
  const [loginId, setLoginId] = React.useState("");           //로그인 사용자ID
  const [commentList, setCommentList] = React.useState([]);   //댓글 리스트 배열
  const [commentContent, setCommentContent] = React.useState(""); //댓글 작성 내용
  const [commentCnt, setCommentCnt] = React.useState("");

  // 컴포넌트 마운팅된 후 실행
  React.useEffect(() => {
    
    //로그인 확인 후 리스트 가져오기
    callSessionConfirm();

  }, []);

  //로그인 확인
  const callSessionConfirm = () => {
    axios.post('/member?type=SessionConfirm', {
        token1 : cookie.load("userid"),
        token2 : cookie.load("username"),
    })
    .then( response => {
        try {

          if(response.data.token1 != null && response.data.token1 != ''){

            setAuth(true);

            var id = response.data.token1;

            setLoginId(id);

            //댓글 리스트 불러오기
            callCommentList(id);

          }else{
            //댓글 리스트 불러오기
            callCommentList("");
          }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  //댓글 개수 가져오기
  const callCommentCount = () => {
    axios.post('/blog?type=commentCount', {
      post_id : post_id
    })
    .then( response => {
        try {

          setCommentCnt(response.data.json[0].cnt);
          
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  //댓글 리스트 불러오기
  const callCommentList = (id) => {
    axios.post('/blog?type=commentList', {
      post_id : post_id
    })
    .then( response => {
        try {

          setCommentList(createCommentList(response, id));
          
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );

    //댓글 개수 가져오기
    callCommentCount();
  }

  //댓글 리스트 그리기
  const createCommentList = (response, id) => {
      let result = []
      var CommentList = response.data
      
      for(let i=0; i<CommentList.json.length; i++){
          var data = CommentList.json[i]

          var comment_id = data.comment_id;
          var comment_content = data.comment_content;
          var user_id = data.user_id;
          var user_name = data.user_name;
          var photo = data.photo;

          var date = data.create_dt;
          var year = date.substr(0,4)
          var month = date.substr(5,2)
          var day = date.substr(8,2)
          var create_dt = year +'.'+month+'.'+day;
          var myComment = user_id == id ? true : false;

          if(i != 0){
            result.push(
              <ListDivider inset={'startContent'} key={'divider' + i}/> 
            )
          }

          result.push(
            <ListItem key={comment_id}>
              <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                <Avatar size="sm"  alt={user_name} src={"/image/" + photo} onClick={handleProfileClick.bind(this, user_id)}/>
              </ListItemDecorator>
              <ListItemContent>
              <Box sx={{ display: 'flex', gap: 1.5}}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography level="h2" fontSize="sm">
                  {user_name}
              </Typography>
                <Typography level="body3">
                    {create_dt}
                </Typography>
                </Box>
                {myComment && 
                    <div style={{marginLeft:'auto'}}>
                      <IconButton aria-label="delete" size="small" onClick={handleDeleteClick.bind(this,comment_id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                }
                </Box>
                <Typography level="body1" fontSize="sm" style={{marginTop:10}}>
                  {comment_content}
                  </Typography>
              </ListItemContent>
            </ListItem>
          )
      }
      return result
  }

  const handleDeleteClick = (comment_id) => {
    axios.post('/blog?type=deleteComment', {
      comment_id : comment_id
    })
    .then( response => {
        try {

          callSessionConfirm();
         
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  //댓글 작성자 프로필 누르면 해당 블로그로 이동
  const handleProfileClick = (user_id) => {
    navigate('/blog/' + user_id);
  }
  
  
  //댓글 등록하기
  const callAddComment = () => {
    axios.post('/blog?type=addComment', {
      post_id : post_id,
      user_id : loginId,
      comment_content : commentContent
    })
    .then( response => {
        try {

          //댓글 작성창 초기화
          setCommentContent("");

          callSessionConfirm();
         
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  const handleSaveClick = () => {
    if(commentContent.trim() != ''){
      callAddComment();
    }
  }

  return (
    <Box sx={{ minWidth: 275 }} style={{marginTop:30}}>
      <CssVarsProvider>
        <Typography level="h5" component="div">
          댓글 ({commentCnt})
        </Typography>
        {!auth &&
          <Typography level="body2" component="div" style={{marginTop:16}}>
            로그인 후 댓글을 작성해 주세요.
          </Typography>
        }
      </CssVarsProvider>
      
      {auth &&
        <div>
          <ThemeProvider theme={theme}>
            <TextField  style={{marginTop:16}}
              id="outlined-multiline-static"
              label="댓글 작성"
              placeholder='댓글을 작성해 주세요.'
              multiline
              rows={4}
              fullWidth 
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
            />
          </ThemeProvider>
          <div style={{marginTop:10}}>
              <Button variant="contained" disableElevation theme={theme} onClick={handleSaveClick}>
                  등록
              </Button>
          </div>
        </div>
      }
        <List sx={{ marginTop:'30px' }}>
          {commentList}
        </List>
      
      
    </Box>
  );
}
