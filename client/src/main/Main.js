import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MainList from './MainList';
import cookie from 'react-cookies';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { createTheme } from '@mui/material';
import { Container } from '@mui/system';
import Avatar from '@mui/joy/Avatar';
import { CssVarsProvider } from '@mui/joy/styles';
import { Link } from 'react-router-dom';

export default function Main() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#333D51",
      },
      secondary: {
        main: "#D3AC2B",
      },
    },
  });
  const navigate = useNavigate();

  const [auth, setAuth] = React.useState(false);
  const [loginId, setLoginId] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [photo, setPhoto] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const goLogin = () => {
    navigate("/login");
  }

  const logout = () => {
    cookie.remove('userid', { path: '/'});
    cookie.remove('username', { path: '/'});
    cookie.remove('userpassword', { path: '/'});
    navigate("/login");
  }

  React.useEffect(() => {
    // 컴포넌트 마운팅된 후 실행
    axios.post('/member?type=SessionConfirm', {
        token1 : cookie.load("userid"),
        token2 : cookie.load("username"),
    })
    .then( response => {
        try {

          if(response.data.token1 != null && response.data.token1 != ''){

            setAuth(true);

            setLoginId(response.data.token1);
            setLoginName(response.data.token2);
            setPhoto(cookie.load("photo"));

          }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar theme={theme}>
        <Container>
          <Toolbar className='mainToolbar'>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Good Blog
            </Typography>
            {!auth && <Button color="inherit" onClick={goLogin}>로그인</Button>}
            {auth && (
              <div>
                <IconButton onClick={handleMenu} sx={{ p: 0 }} >
                  <CssVarsProvider>
                    <Avatar alt={loginName} src={"/image/" + photo} />
                  </CssVarsProvider>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  
                  <MenuItem component={Link} to={"/blog/" + loginId}>내 블로그</MenuItem>
                  <MenuItem component={Link} to="/manage/post">글 쓰기</MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/manage/profile">프로필 설정</MenuItem>
                  <MenuItem component={Link} to="/manage">블로그 설정</MenuItem>
                  <MenuItem component={Link} to="/manage/category">카테고리 설정</MenuItem>
                  <Divider />
                  <MenuItem onClick={logout}>로그아웃</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Toolbar />
        <MainList />
      </Container>
    </Box>
  );
}
