import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Card } from '@mui/material';
import { CardMedia } from '@mui/material';

class ManagePost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            rows: [],
            text: '',
            selCategory: '',
            thumbnail: '',
        }

    }

    componentDidMount() {
        this.callBlogCategoryApi()
    }

    callBlogCategoryApi = async () => {
        axios.post('/manage?type=category', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                this.setState({ rows: response.data.json });
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
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handleEditorChange = (event) => {
        this.setState({ text: event })
    }

    handleCateChange= (event) => {
        this.setState({ selCategory: event.target.value })
    }

    handleSubmit = (event) => {

        const data = new FormData(event.currentTarget);

        let valid = true;
        console.log(valid);

        if(valid){
            this.callAddPostApi(data);
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

    render () {
        return (
            <Container>
                <Box sx={{ minWidth: 275 }} style={{marginTop:16}} component="form" noValidate onSubmit={this.handleSubmit}>
                    <Typography variant="h5" component="div">
                        글 쓰기
                    </Typography>
                    <div>
                        <Button variant="outlined" startIcon={<AddIcon />} style={{marginTop:16}} type="submit">
                            저장
                        </Button>
                    </div>
                    <div style={{marginTop:16}}>
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
                        />
                    </div>
                    <div style={{marginTop:16}}>
                        {this.state.thumbnail && <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                alt=""
                                height="140"
                                image={"/image/" + this.state.thumbnail}
                            />
                        </Card>}
                        <input type="file" name="file" onChange={this.handlePostImage}/>	
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
            </Container>
        );
    }
}

export default ManagePost;