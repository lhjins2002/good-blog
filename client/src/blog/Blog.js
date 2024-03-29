import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BlogCategory from './BlogCategory';
import BlogList from './BlogList';
import { useParams } from "react-router";
import BlogView from './BlogView';
import { Route, Routes, useLocation } from "react-router-dom";
import ManageCategory from '../manage/ManageCategory';
import ManagePost from '../manage/ManagePost';
import cookie from 'react-cookies';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ManageBlog from '../manage/ManageBlog';
import ManageProfile from '../manage/ManageProfile';
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

const drawerWidth = 240;

 const Blog = (props) => {
  //const theme = useTheme();
  let { owner_id } = useParams();
  let { post_id } = useParams();
  let { cate_id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [auth, setAuth] = React.useState(false);
  const [loginId, setLoginId] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [manageContentArea, setManageContentArea] = React.useState(null);
  const [manageMenuArea, setManageMenuArea] = React.useState(null);

  const [blogName, setBlogName] = React.useState("");
  const [blogTheme, setBlogTheme] = React.useState("");
  const [blogLink, setBlogLink] = React.useState("");

  const theme = createTheme({
    palette: {
      primary: {
        main: blogTheme == null ||blogTheme == ''?"#ffffff":blogTheme,
      },
      secondary: {
        main: "#D3AC2B",
      },
    },
  });

  const location = useLocation();
  let isManage = false;
  if(location.pathname.startsWith("/manage")){
    isManage = true;
  }

  let isView = false;
  if(location.pathname.startsWith("/view")){
    isView = true;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const getBlogName = (user_id) => {
    axios.post('/blog?type=bloginfo', {
        owner_id : user_id,
    })
    .then( response => {
        try {
          setBlogName(response.data.json[0].blog_name);
          setBlogTheme(response.data.json[0].blog_theme);
          setBlogLink('/blog/' + user_id);
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }

  React.useEffect(() => {
    setAnchorEl(null);
    // 컴포넌트 마운팅된 후 실행
    axios.post('/member?type=SessionConfirm', {
        token1 : cookie.load("userid"),
        token2 : cookie.load("username")
    })
    .then( response => {
        try {

          isManage = false;
          if(location.pathname.startsWith("/manage")){
            isManage = true;
          }

          isView = false;
          if(location.pathname.startsWith("/view")){
            isView = true;
          }

          var user_id = "";

          if(response.data.token1 != null && response.data.token1 != ''){

            user_id = response.data.token1;

            setAuth(true);
            setLoginId(response.data.token1);
            setLoginName(response.data.token2);
            setPhoto(cookie.load("photo"));

            if(isManage){
              setManageContentArea(<Routes>
                <Route path='' element={<ManageBlog owner_id={user_id} />} />
                <Route path='category' element={<ManageCategory owner_id={user_id} />} />
                <Route path='post' element={<ManagePost owner_id={user_id} />} />
                <Route path='post/:post_id' element={<ManagePost owner_id={user_id} post_id={post_id} />} />
                <Route path='profile' element={<ManageProfile owner_id={user_id} />} />
              </Routes>);

              setManageMenuArea(<BlogCategory owner_id={user_id} />);

              
            }
          }else{
            //로그인되지 않았는데 manage로 들어오면 로그인 페이지로 이동
            if(isManage){
              navigate("/login");
              return;
            }
          }

          if(isManage){
            getBlogName(user_id);
          }else{
            getBlogName(owner_id);
          }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    })
    .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
  }, [location, owner_id]);

  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
    <div onClick={handleDrawerToggle}>
      <Toolbar style={{padding:'0 16px'}}>
        <Typography variant="h6" noWrap component={Link} to="/" sx={{ flexGrow: 1, textDecoration:'none', color:'#183F48', }}>
            Good Blog
          </Typography>
      </Toolbar>
      <Divider />
      { !isManage && <BlogCategory owner_id={owner_id} /> }
      { isManage && manageMenuArea }
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" 
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }} 
        theme={theme} elevation={0} style={{borderBottom:'1px solid rgba(0, 0, 0, 0.12)'}}>
      <Container>
        <Toolbar className='mainToolbar'>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component={Link} to={blogLink} sx={{ flexGrow: 1, textDecoration:'none', color:'inherit' }}>
            {blogName}
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
         <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
          <Toolbar />
          { !isManage && isView &&
            <Routes>
              <Route path=':owner_id/:post_id' element={<BlogView owner_id={owner_id} post_id={post_id} />} />
            </Routes>
          }
          { !isManage && !isView &&
            <Routes>
              <Route path=':owner_id' element={<BlogList owner_id={owner_id} />} />
              <Route path=':owner_id/:cate_id' element={<BlogList owner_id={owner_id} cate_id={cate_id} />} />
            </Routes>
          }
          { isManage && manageContentArea }
        </Box>
      </Box>
  );
}
export default Blog;
