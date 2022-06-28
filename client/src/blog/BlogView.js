import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css'

class BlogView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            post_id: props.post_id,
            rows: [],
            text: '',
            subject: '',
            thumbnail:'',
        }

    }

    componentDidMount() {
        this.callBlogCategoryApi()
    }

    callBlogCategoryApi = async () => {
        axios.post('/blog?type=view', {
            owner_id : this.state.owner_id,
            post_id : this.state.post_id
        })
        .then( response => {
            try {
                this.setState({ rows: response.data.json,
                                text: response.data.json[0].post_content,
                                subject: response.data.json[0].post_name,
                                thumbnail: response.data.json[0].thumbnail
                });
                
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


    render () {
        return (
            <Container>
                <Box sx={{ minWidth: 275 }} style={{marginTop:16}} component="form" noValidate onSubmit={this.handleSubmit}>
                    <Typography variant="h5" component="div">
                        {this.state.subject}
                    </Typography>
                    {this.state.thumbnail && <div style={{marginTop:16}}>
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
                </Box>
            </Container>
        );
    }
}

export default BlogView;