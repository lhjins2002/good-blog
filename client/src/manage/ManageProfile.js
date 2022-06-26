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
import { Avatar } from '@mui/material';
import cookie from 'react-cookies';

class ManageProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            user_name: "",
            photo: "",
        }
    }

    componentDidMount() {
        this.callProfileApi()
    }

    callProfileApi = async () => {
        axios.post('/manage?type=profile', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                this.setState({ user_name: response.data.json[0].user_name });
                this.setState({ photo: response.data.json[0].photo });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    callEditProfileApi = async (data) => {
        axios.post('/manage?type=editProfile', {
            photo : this.state.photo,
            user_name : data.get('userName'),
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                cookie.save("photo", this.state.photo);
                this.callProfileApi();
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
            this.callEditProfileApi(data);
        }
    };

    handlePostImage = (e) => {

        const postFile = e.target.files[0];
        
        const formData = new FormData();
        formData.append('file', postFile);
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            this.setState({photo : res.data.filename});
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')            
        })
    }

    render () {
        return (
            <Container>
                <Box sx={{ minWidth: 275 }} style={{marginTop:16}} component="form" noValidate onSubmit={this.handleSubmit}>
                    <Typography variant="h5" component="div">
                        프로필 설정
                    </Typography>
                    <div>
                        <Button variant="outlined" startIcon={<AddIcon />} style={{marginTop:16}} type="submit">
                            저장
                        </Button>
                    </div>
                    <div style={{marginTop:16}}>
                        <Avatar
                            alt={this.state.user_name}
                            src={"/image/" + this.state.photo}
                            sx={{ width: 72, height: 72 }}
                        />
                        <input type="file" name="file" onChange={this.handlePostImage}/>	
                    </div>
                    <div style={{marginTop:16}}>
                        <TextField
                        value={this.state.user_name}
                        onChange={(event) => this.setState({user_name:event.target.value})}
                        margin="dense"
                        required
                        fullWidth
                        name="userName"
                        label="닉네임"
                        type="text"
                        id="userName"
                        autoComplete="userName"
                        />
                    </div>
                </Box>
            </Container>
        );
    }
}

export default ManageProfile;