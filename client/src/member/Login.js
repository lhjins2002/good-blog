import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import cookie from 'react-cookies';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#183F48",
    },
    secondary: {
      main: "#D3AC2B",
    },
  },
});

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
          setAlertMsg("아이디를 입력해 주세요.");
          setOpen(true);
          return false;
      }
      if(data.get('password') == ""){
          setAlertMsg("비밀번호를 입력해 주세요.");
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
          })
          .then( response => {
              cookie.save('userid', response.data.token1
              , { path: '/', expires })
              cookie.save('username', response.data.token2
              , { path: '/', expires })
              cookie.save('userpassword', upw
              , { path: '/', expires })
              cookie.save('photo', photo
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
          <CssVarsProvider>
          <Typography level="h3" style={{color:theme.palette.primary.main}}>
                Good Blog
            </Typography>
            <Typography level="h5" style={{marginTop:10}}>
                로그인
            </Typography>
          </CssVarsProvider>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="id"
              label="아이디"
              name="id"
              autoComplete="id"
              autoFocus
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="password"
            />
            </Grid>
            {open && <Grid item xs={12}>
                <Alert variant="outlined" severity="error">
                    { alertMsg }
                </Alert>
                </Grid>
            }
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained" disableElevation
              sx={{ mt: 3, mb: 2 }}
              size='large'
            >
              로그인
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"가입하기"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}