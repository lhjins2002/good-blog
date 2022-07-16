import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/joy/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { createTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { withRouter } from '../common/withRouter';
import ImageIcon from '@mui/icons-material/Image';
import { ThemeProvider } from '@mui/material/styles';

class ManagePost extends React.Component {
    constructor(props) {
        super(props);

        let mode = 'add';
        if(props.post_id != null && props.post_id != ''){
            mode = 'modify';
        }

        this.state = {
            owner_id: props.owner_id,
            post_id: props.post_id,
            rows: [],
            text: '',
            selCategory: '',
            thumbnail: '',
            noCateAlertOpen: false,
            subject:'',
            mode: mode,
        }

    }

    componentDidMount() {
        this.callBlogCategoryApi();

        //post_id가 있을 경우 수정 모드
        if(this.state.mode == 'modify'){
            this.callBlogViewApi();
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.post_id !== prevProps.post_id || this.state.post_id !== prevState.post_id){
            this.setState({ post_id:this.props.post_id});
            
            let mode = 'add';
            if(this.props.post_id != null && this.props.post_id != ''){
                mode = 'modify';
            }
            this.setState({mode:mode});

            if(mode == 'add'){
                this.setState({ text: '',
                    subject: '',
                    thumbnail: '',
                    selCategory: '',
                });
            }else{
                this.callBlogViewApi();
            }
        }
    }

    callBlogCategoryApi = async () => {
        await axios.post('/manage?type=category', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {

                if(response.data.json.length == 0){
                    this.setState({noCateAlertOpen:true});
                }
                
                this.setState({ rows: response.data.json });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    callBlogViewApi = async () => {
        axios.post('/blog?type=view', {
            owner_id : this.state.owner_id,
            post_id : this.props.post_id
        })
        .then( response => {
            try {

                this.setState({ text: response.data.json[0].post_content,
                                subject: response.data.json[0].post_name,
                                thumbnail: response.data.json[0].thumbnail,
                                selCategory: response.data.json[0].category_id,
                });
                
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    callAddPostApi = async (data) => {
        axios.post('/manage?type=addPost', {
            category_id : data.get("category"),
            post_name : data.get("subject"),
            post_content : this.state.text,
            thumbnail : this.state.thumbnail,
        })
        .then( response => {
            try {
                //this.callBlogCategoryApi();
                this.props.navigate('/blog/' + this.state.owner_id);
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //포스팅 수정 API 호출
    callModifyPostApi = async (data) => {
        axios.post('/manage?type=modifyPost', {
            category_id : data.get("category"),
            post_name : data.get("subject"),
            post_content : this.state.text,
            thumbnail : this.state.thumbnail,
            post_id : this.state.post_id
        })
        .then( response => {
            try {
                //this.callBlogCategoryApi();
                this.props.navigate('/blog/' + this.state.owner_id);
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handleEditorChange = (event) => {
        this.setState({ text: event })
    }

    handleSubjectChange = (event) => {
        this.setState({ subject: event.target.value })
    }

    handleCateChange= (event) => {
        this.setState({ selCategory: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let valid = true;
        console.log(valid);

        if(valid){
            if(this.state.mode == 'add'){
                this.callAddPostApi(data);
            }else{
                this.callModifyPostApi(data);
            }
        }

    };

    handlePostImage = (e) => {

        const postFile = e.target.files[0];
        
        const formData = new FormData();
        formData.append('file', postFile);
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            this.setState({thumbnail : res.data.filename});
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')            
        })
    }

    handleCateAlert = () =>{
        this.props.navigate('/manage/category');
    }

    // 이미지 처리를 하는 핸들러
    imageHandler = () => {
  
    const input = document.createElement('input');
    
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); 
    
    input.addEventListener('change', async () => {
      const file = input.files[0];
      
      const formData = new FormData();
      formData.append('file', file); 
      try {
        const result = await axios.post('/api/upload?type=uploads/image/', formData);
        const IMG_URL = result.data.filename;
        
        const editor = this.quillRef.current.getEditor();
        
        const range = editor.getSelection();
        
        editor.insertEmbed(range.index, 'image', "/image/" + IMG_URL);
      } catch (error) {
        alert('작업중 오류가 발생하였습니다.')  
      }
    });
  };

    modules = {
        toolbar: {
            container: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
            ],
        handlers: {
            image: this.imageHandler,
          }
        }
      }
     
      formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]

      quillRef = React.createRef();

      Input = styled('input')({
        display: 'none',
      });

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
                <Box sx={{ minWidth: 275 }} style={{marginTop:30}} component="form" noValidate onSubmit={this.handleSubmit}>
                    <Typography level="h3" component="div">
                        {this.state.mode == "add" && '글 쓰기'}
                        {this.state.mode == "modify" && '글 수정'}
                    </Typography>
                    <div style={{marginTop:30}}>
                        <Button variant="contained" disableElevation type="submit" theme={this.theme}>
                            저장
                        </Button>
                    </div>
                    <div style={{marginTop:30}}>
                    <ThemeProvider theme={this.theme}>
                    <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">카테고리명</InputLabel>
                        <Select
                            labelId="category"
                            id="category"
                            name="category"
                            label="카테고리명"
                            value={this.state.selCategory}
                            onChange={this.handleCateChange}
                        >
                            {this.state.rows.map((row) => (
                                <MenuItem key={row.category_id} value={row.category_id}>{row.category_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                        <TextField
                        margin="dense"
                        required
                        fullWidth
                        name="subject"
                        label="제목"
                        type="text"
                        id="subject"
                        autoComplete="subject"
                        value={this.state.subject || ''}
                        onChange={this.handleSubjectChange}
                        />
                    </ThemeProvider>
                    </div>
                    <div style={{marginTop:16}}>
                        <Typography level="h6" component="div">
                            썸네일 이미지
                        </Typography>
                        <AspectRatio style={{width:300, marginBottom:10, marginTop:10}}>
                            {this.state.thumbnail && <img
                                src={"/image/" + this.state.thumbnail} 
                                alt=""
                            />
                            }
                            {!this.state.thumbnail && <div data-first-child>
                                <ImageIcon sx={{ color: 'text.tertiary', fontSize:64 }} />
                                </div>
                            }
                        </AspectRatio>
                        <label htmlFor="contained-button-file">
                            <this.Input accept="image/*" id="contained-button-file" multiple type="file" onChange={this.handlePostImage} />
                            <Button variant="outlined" component="span" startIcon={<PhotoCamera />} theme={this.theme}>
                                업로드
                            </Button>
                        </label>
                        
                    </div>
                    <div style={{marginTop:16}}>
                        <ReactQuill ref={this.quillRef}
                                    theme="snow"
                                    modules={this.modules}
                                    formats={this.formats}
                                    value={this.state.text}
                                    onChange={this.handleEditorChange}>
                        </ReactQuill>
                    </div>
                </Box>
                <Dialog
                    open={this.state.noCateAlertOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    카테고리가 없습니다.
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        먼저 카테고리를 만들어 주세요.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleCateAlert} autoFocus>
                        확인
                    </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}

export default withRouter(ManagePost);