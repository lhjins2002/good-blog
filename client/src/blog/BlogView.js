import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css'
import Avatar from '@mui/joy/Avatar';

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
            user_name:'',
            photo:'',
            reg_date:'',
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

                var date = response.data.json[0].create_dt
                var year = date.substr(0,4)
                var month = date.substr(5,2)
                var day = date.substr(8,2)
                var reg_date = year +'.'+month+'.'+day;

                this.setState({ rows: response.data.json,
                                text: response.data.json[0].post_content,
                                subject: response.data.json[0].post_name,
                                thumbnail: response.data.json[0].thumbnail,
                                user_name: response.data.json[0].user_name,
                                photo: response.data.json[0].photo,
                                reg_date: reg_date,
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
                    <Typography level="h5" component="div">
                        {this.state.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, marginTop:'16px' }}>
                        <Avatar alt={this.state.user_name} src={"/image/" + this.state.photo} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography level="h2" fontSize="md" sx={{ alignSelf: 'flex-start' }}>
                                {this.state.user_name}
                            </Typography>
                            <Typography level="body2">{this.state.reg_date}</Typography>
                        </Box>
                    </Box>
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