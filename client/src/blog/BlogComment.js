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
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import { useParams } from "react-router";

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

  // 컴포넌트 마운팅된 후 실행
  React.useEffect(() => {
    
    //로그인 확인
    callSessionConfirm();

    //댓글 리스트 불러오기
    callCommentList();

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

            setLoginId(response.data.token1);

          }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  //댓글 리스트 불러오기
  const callCommentList = () => {
    axios.post('/member?type=SessionConfirm', {
        token1 : cookie.load("userid"),
        token2 : cookie.load("username"),
    })
    .then( response => {
        try {

          if(response.data.token1 != null && response.data.token1 != ''){

            setAuth(true);

            setLoginId(response.data.token1);

          }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  return (
    <Box sx={{ minWidth: 275 }} style={{marginTop:16}}>
      <Box  sx={{ display: 'flex', gap: 1}}>
        <CssVarsProvider>
          <Typography level="h5" component="div">
            댓글 (0)
          </Typography>
          
        </CssVarsProvider>

          <IconButton theme={theme} size="small">
              <RefreshIcon />
          </IconButton>
      </Box>
      
      <ThemeProvider theme={theme}>
        <TextField  style={{marginTop:16}}
          id="outlined-multiline-static"
          label="댓글 작성"
          multiline
          rows={4}
          defaultValue=""
          fullWidth 
        />
      </ThemeProvider>
      <div style={{marginTop:10}}>
          <Button variant="contained" disableElevation theme={theme}>
              등록
          </Button>
      </div>
      
      
    </Box>
  );
}
