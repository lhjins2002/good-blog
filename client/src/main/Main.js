import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/joy/Typography';
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
import LogoutIcon from '@mui/icons-material/Logout';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import BookIcon from '@mui/icons-material/Book';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function Main() {
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
    <Box>
      <CssBaseline />
      <AppBar theme={theme} elevation={0}>
        <Container>
          <Toolbar className='mainToolbar'>
            <Typography level="h4" noWrap component={Link} to="/" sx={{ flexGrow: 1, textDecoration:'none', color:'#fff' }}>
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
                  
                <MenuItem component={Link} to={"/blog/" + loginId}>
                  <ListItemIcon>
                    <BookIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>내 블로그</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/manage/post">
                  <ListItemIcon>
                    <PostAddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>글 쓰기</ListItemText>
                </MenuItem>
                  <Divider />
                <MenuItem component={Link} to="/manage/profile">
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>프로필 설정</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/manage">
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>블로그 설정</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/manage/category">
                  <ListItemIcon>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>카테고리 설정</ListItemText>
                </MenuItem>
                  <Divider />
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>로그아웃</ListItemText>
                </MenuItem>
              </Menu>
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      <div style={{borderBottom:'1px solid #E7EBF0',backgroundColor:'#f8f8f8', minHeight:150}}>
      <Container maxWidth="md" style={{paddingTop:40, paddingBottom:40}}>
        <Typography level="h3">
              블로그 서비스
        </Typography>
        <Typography level="body1" style={{marginTop:10, }}>
              내 블로그에 글을 써보세요.
        </Typography>
        <Button variant="contained" disableElevation style={{marginTop:16, }} size="large" theme={theme} component={Link} to="/manage/post">
            시작하기
        </Button>
        </Container>
      </div>
      <Container maxWidth="md">
        <MainList />
      </Container>
    </Box>
  );
}
