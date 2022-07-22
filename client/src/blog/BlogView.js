import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css'
import Avatar from '@mui/joy/Avatar';
import { CssVarsProvider } from '@mui/joy/styles';
import cookie from 'react-cookies';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { withRouter } from '../common/withRouter';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import BlogComment from './BlogComment';

class BlogView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,   //블로그 주인 ID
            post_id: props.post_id,     //글 ID
            text: '',                   //글 본문 내용
            subject: '',                //글 제목
            thumbnail:'',               //글 썸네일 이미지
            user_name:'',               //작성자 이름
            photo:'',                   //작성자 프로필 이미지
            reg_date:'',                //작성일
            category_name:'',           //카테고리명
            my_post:false,              //내 글인지 여부(수정/삭제 버튼 표시 여부)
            deleteAlertOpen:false,      //글 삭제 알림 창 표시 여부
        }

    }

    //컴포넌트 마운팅된 후 실행
    componentDidMount() {
        //포스팅 정보 가져오기
        this.callBlogViewApi();
        //내 글인지 체크
        this.callSessionConfirmApi();
    }

    //로그인 체크
    callSessionConfirmApi = async () => {
        axios.post('/member?type=SessionConfirm', {
            token1 : cookie.load("userid"),
            token2 : cookie.load("username"),
        })
        .then( response => {
            try {
    
              if(response.data.token1 != null && response.data.token1 != ''){
    
                //내 글인지 체크(내 글이면 수정/삭제 표시)
                if(response.data.token1 == this.state.owner_id){
                    this.setState({ my_post: true,});
                }else{
                    this.setState({ my_post: false,});
                }
    
              }
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //글 정보 조회
    callBlogViewApi = async () => {
        axios.post('/blog?type=view', {
            owner_id : this.state.owner_id,
            post_id : this.state.post_id
        })
        .then( response => {
            try {

                var date = response.data.json[0].create_dt
                var year = date.substr(0,4)
                var month = date.substr(5,2)
                var day = date.substr(8,2)
                var reg_date = year +'.'+month+'.'+day;

                this.setState({ text: response.data.json[0].post_content,
                                subject: response.data.json[0].post_name,
                                thumbnail: response.data.json[0].thumbnail,
                                user_name: response.data.json[0].user_name,
                                photo: response.data.json[0].photo,
                                reg_date: reg_date,
                                category_name: response.data.json[0].category_name,
                });
                
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //글 삭제 처리
    callDeletePostApi = async () => {
        axios.post('/manage?type=deletePost', {
            post_id : this.state.post_id
        })
        .then( response => {
            try {

                //글 삭제 후 블로그 메인으로 이동
                this.props.navigate('/blog/' + this.state.owner_id);
                
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //글 수정 버튼 클릭 이벤트
    handleModifyClick = () => {
        this.props.navigate('/manage/post/' + this.state.post_id);
    }

    //글 삭제 버튼 클릭 이벤트
    handleDeleteClick = () => {
        //this.callDeletePostApi();
        this.setState({ deleteAlertOpen : true });
    }

    //글 삭제 알림창 닫기 이벤트
    handleClose = () => {
        this.setState({deleteAlertOpen : false});
    };

    //프로필 이미지 클릭 이벤트
    handleProfileClick = () => {
        this.props.navigate('/blog/' + this.state.owner_id);
    }

    theme = createTheme({
        palette: {
          primary: {
            main: "#183F48",
          },
          secondary: {
            main: "#D3AC2B",
          },
        },
      });

    render () {
        return (
            <Container maxWidth="md">
                
                <Box sx={{ minWidth: 275 }} style={{marginTop:30}}>
                    <CssVarsProvider>
                    <Typography level="body3" component="div">
                        {this.state.category_name}
                    </Typography>
                    <Typography level="h3" component="div">
                        {this.state.subject}
                    </Typography>
                    </CssVarsProvider>
                    <Box sx={{ display: 'flex', gap: 1.5, marginTop:'16px' }}>
                        <CssVarsProvider>
                        <Avatar alt={this.state.user_name} src={"/image/" + this.state.photo} onClick={this.handleProfileClick}/>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography level="h2" fontSize="md" sx={{ alignSelf: 'flex-start' }}>
                                {this.state.user_name}
                            </Typography>
                            <Typography level="body2">{this.state.reg_date}</Typography>
                        </Box>
                        </CssVarsProvider>
                        {this.state.my_post &&
                            <div style={{marginLeft:'auto'}}>
                            <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                <Button theme={this.theme} onClick={this.handleModifyClick}>
                                            <EditIcon />
                                        </Button>
                                <Button theme={this.theme} onClick={this.handleDeleteClick}>
                                            <DeleteIcon />
                                       </Button>
                            </ButtonGroup>
                            </div>
                        }       
                    </Box>
                    <div style={{marginTop:30}}>
                    {this.state.thumbnail && <div>
                        <img style={{maxWidth:'100%'}}
                            src={"/image/" + this.state.thumbnail}
                            alt=""
                            />
                    </div>}
                    <div style={{marginTop:16}}>
                        <ReactQuill theme={"bubble"}
                                    value={this.state.text}
                                    readOnly="true">
                        </ReactQuill>
                    </div>
                    </div>
                </Box>
                <Divider style={{marginTop:50}} />
                <BlogComment post_id={this.state.post_id} />
                <Dialog open={this.state.deleteAlertOpen} onClose={this.handleClose}>
                    <ThemeProvider theme={this.theme}>
                    <Box>
                        <DialogTitle>확인</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                글을 삭제하시겠습니까?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose}>취소</Button>
                        <Button onClick={this.callDeletePostApi}>확인</Button>
                        </DialogActions>
                        </Box>
                    </ThemeProvider>
                    </Dialog>
            </Container>
        );
    }
}

export default withRouter(BlogView);