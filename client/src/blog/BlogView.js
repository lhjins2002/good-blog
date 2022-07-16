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

class BlogView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            post_id: props.post_id,
            text: '',
            subject: '',
            thumbnail:'',
            user_name:'',
            photo:'',
            reg_date:'',
            category_name:'',
            my_post:false,
            deleteAlertOpen:false,
        }

    }

    //컴포넌트 마운팅된 후 실행
    componentDidMount() {
        //포스팅 정보 가져오기
        this.callBlogViewApi();
        //내 글인지 체크
        this.callSessionConfirmApi();
    }

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

    callDeletePostApi = async () => {
        axios.post('/manage?type=deletePost', {
            post_id : this.state.post_id
        })
        .then( response => {
            try {

                this.props.navigate('/blog/' + this.state.owner_id);
                
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handleModifyClick = () => {
        this.props.navigate('/manage/post/' + this.state.post_id);
    }

    handleDeleteClick = () => {
        //this.callDeletePostApi();
        this.setState({ deleteAlertOpen : true });
    }

    handleClose = () => {
        this.setState({deleteAlertOpen : false});
    };

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
                        <Avatar alt={this.state.user_name} src={"/image/" + this.state.photo} />
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