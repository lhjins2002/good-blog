import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import cookie from 'react-cookies';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Good Blog
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let valid = validCheck(data);
    console.log(valid);

    if(valid){
        callLoginApi(data);
    }
  };

  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");

  const validCheck = (data) => {
      if(data.get('id') == ""){
          setAlertMsg("[아이디]를 입력해 주세요.");
          setOpen(true);
          return false;
      }
      if(data.get('password') == ""){
          setAlertMsg("[비밀번호]를 입력해 주세요.");
          setOpen(true);
          return false;
      }

      return true;
  };

  const callLoginApi = (data) => {

    axios.post('/member?type=login', {
      user_id : data.get('id'),
      user_password : data.get('password'),
    })
    .then( response => {
      var userid = response.data.json[0].user_id;
      var username = response.data.json[0].user_name;
      var upw = response.data.json[0].user_password;
      var photo = response.data.json[0].photo;

      if(userid != null && userid != ''){
          const expires = new Date()
          expires.setMinutes(expires.getMinutes() + 60)
          
          axios.post('/member?type=SessionState', {
              user_id: userid,
              user_name: username,
              photo: photo,
          })
          .then( response => {
              cookie.save('userid', response.data.token1
              , { path: '/', expires })
              cookie.save('username', response.data.token2
              , { path: '/', expires })
              cookie.save('userpassword', upw
              , { path: '/', expires })
              cookie.save('photo', response.data.token3
              , { path: '/', expires })

              navigate("/");
          })  
          .catch( error => {
            setAlertMsg("아이디와 비밀번호를 확인해 주세요.");
            setOpen(true);
          });
      }else{
        setAlertMsg("아이디와 비밀번호를 확인해 주세요.");
        setOpen(true);
      }

    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );

  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <ThumbUpIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Good Blog 로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="아이디"
              name="id"
              autoComplete="id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="password"
            />
            {open && 
                <Alert variant="outlined" severity="error">
                    { alertMsg }
                </Alert>
            }
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="아이디 기억하기"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  비밀번호 찾기
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"가입하기"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}