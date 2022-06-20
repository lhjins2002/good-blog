import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class ManageBlog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            blog_id:'',
            blog_name:'',
            blog_theme:'',
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

    handleClickOpen = () => {
        this.setState({modalOpen : true});
    };
    
    handleClose = () => {
        this.setState({modalOpen : false});
    };

    handleSubmit = (event) => {

        const data = new FormData(event.currentTarget);
        let valid = true;
        console.log(valid);

        if(valid){
            this.callEditBlogApi(data);
        }
    };

    render () {
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
                </Box>
            </Container>
        );
    }
}

export default ManageBlog;