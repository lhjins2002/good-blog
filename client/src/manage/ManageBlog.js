import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import {TwitterPicker} from 'react-color';
import reactCSS from 'reactcss'

class ManageBlog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            blog_id:'',
            blog_name:'',
            blog_theme:'',
            displayColorPicker:false,
        }
    }

    componentDidMount() {
        this.callBlogApi()
    }

    callBlogApi = async () => {
        axios.post('/manage?type=blog', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                this.setState({ blog_id: response.data.json[0].blog_id });
                this.setState({ blog_name: response.data.json[0].blog_name });
                this.setState({ blog_theme: response.data.json[0].blog_theme });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    callEditBlogApi = async (data) => {
        axios.post('/manage?type=editBlog', {
            blog_id : this.state.blog_id,
            blog_name : data.get('blogName'),
            blog_theme : this.state.blog_theme,
        })
        .then( response => {
            try {
                this.callBlogApi();
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handleSubmit = (event) => {

        const data = new FormData(event.currentTarget);
        let valid = true;
        console.log(valid);

        if(valid){
            this.callEditBlogApi(data);
        }
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
    
      handleClose = () => {
        this.setState({ displayColorPicker: false })
      };

    handleChange = (color) => {
        this.setState({ blog_theme: color.hex })
      };

    render () {

        const styles = reactCSS({
            'default': {
              color: {
                width: '36px',
                height: '36px',
                borderRadius: '2px',
                background: `${ this.state.blog_theme }`,
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              },
              popover: {
                position: 'absolute',
                zIndex: '2',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
          });

        return (
            <Container>
                <Box sx={{ minWidth: 275 }} style={{marginTop:16}} component="form" noValidate onSubmit={this.handleSubmit}>
                    <Typography variant="h5" component="div">
                        블로그 설정
                    </Typography>
                    <div>
                        <Button variant="outlined" startIcon={<AddIcon />} style={{marginTop:16}} type="submit">
                            저장
                        </Button>
                    </div>
                    <div style={{marginTop:16}}>
                        <TextField
                        value={this.state.blog_name}
                        onChange={(event) => this.setState({blog_name:event.target.value})}
                        margin="dense"
                        required
                        fullWidth
                        name="blogName"
                        label="블로그 이름"
                        type="text"
                        id="blogName"
                        autoComplete="blogName"
                        />
                    </div>
                    <div style={{marginTop:16}}>
                    <div>
                        <div style={ styles.swatch } onClick={ this.handleClick }>
                        <div style={ styles.color } />
                        </div>
                        { this.state.displayColorPicker ? <div style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleClose }/>
                        <TwitterPicker color={ this.state.blog_theme } onChange={ this.handleChange } />
                        </div> : null }

                    </div>
                    </div>
                </Box>
            </Container>
        );
    }
}

export default ManageBlog;