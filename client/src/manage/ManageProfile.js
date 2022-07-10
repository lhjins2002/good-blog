import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/joy/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import { createTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import cookie from 'react-cookies';
import Avatar from '@mui/joy/Avatar';
import { CssVarsProvider } from '@mui/joy/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import ImageIcon from '@mui/icons-material/Image';
import { ThemeProvider } from '@mui/material/styles';

class ManageProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            user_name: "",
            photo: "",
            introduce: '',
            back_photo: '',
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
                this.setState({ introduce: response.data.json[0].introduce });
                this.setState({ back_photo: response.data.json[0].back_photo });
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
            introduce : this.state.introduce,
            back_photo : this.state.back_photo,
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

    handlePostPhoto = (e) => {

        const postFile = e.target.files[0];
        
        const formData = new FormData();
        formData.append('file', postFile);
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            this.setState({photo : res.data.filename});
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')            
        })
    }

    handlePostBackPhoto = (e) => {

        const postFile = e.target.files[0];
        
        const formData = new FormData();
        formData.append('file', postFile);
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            this.setState({back_photo : res.data.filename});
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')            
        })
    }

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
                        프로필 설정
                    </Typography>
                    <div style={{marginTop:30}}>
                        <Button variant="contained" disableElevation type="submit" theme={this.theme} size='large'>
                            저장
                        </Button>
                    </div>
                    
                    <div style={{marginTop:16}}>
                    <ThemeProvider theme={this.theme}>
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
                        <TextField
                        value={this.state.introduce}
                        onChange={(event) => this.setState({introduce:event.target.value})}
                        margin="dense"
                        required
                        fullWidth
                        name="introduce"
                        label="자기소개"
                        type="text"
                        id="introduce"
                        autoComplete="introduce"
                        />
                    </ThemeProvider>
                    </div>
                    <div style={{marginTop:16}}>
                        <Typography level="h6" component="div">
                            배경 이미지
                        </Typography>
                        <AspectRatio style={{width:300, marginBottom:10, marginTop:10}}>
                            {this.state.back_photo && <img
                                src={"/image/" + this.state.back_photo} 
                                alt=""
                            />
                            }
                            {!this.state.back_photo && <div data-first-child>
                                <ImageIcon sx={{ color: 'text.tertiary', fontSize:64 }} />
                                </div>
                            }
                        </AspectRatio>
                        <label htmlFor="contained-button-file">
                            <this.Input accept="image/*" id="contained-button-file" multiple type="file" onChange={this.handlePostBackPhoto} />
                            <Button variant="outlined" component="span" startIcon={<PhotoCamera />} theme={this.theme}>
                                업로드
                            </Button>
                        </label>
                    </div>
                    <div style={{marginTop:16}}>
                        <Typography level="h6" component="div">
                            프로필 이미지
                        </Typography>
                        <CssVarsProvider>
                            <Avatar style={{ marginBottom:10, marginTop:10}}
                                alt={this.state.user_name}
                                src={"/image/" + this.state.photo}
                                sx={{ width: 72, height: 72 }}
                            />
                        </CssVarsProvider>
                        <label htmlFor="contained-button-file2">
                            <this.Input accept="image/*" id="contained-button-file2" multiple type="file" onChange={this.handlePostPhoto} />
                            <Button variant="outlined" component="span" startIcon={<PhotoCamera />} theme={this.theme}>
                                업로드
                            </Button>
                        </label>
                        
                    </div>
                </Box>
            </Container>
        );
    }
}

export default ManageProfile;