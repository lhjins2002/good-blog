import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';


const theme = createTheme({
    palette: {
      primary: {
        main: "#183F48",
      },
      secondary: {
        main: "#D3AC2B",
      },
    },
  });

export default function SignUp() {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        setOpen(false);

        const data = new FormData(event.currentTarget);
        let valid = validCheck(data);
        console.log(valid);

        if(valid){
            callSignUpApi(data);
        }
    };

    const [open, setOpen] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");

    const validCheck = (data) => {
        if(data.get('id') == ""){
            setAlertMsg("아이디를 입력해 주세요.");
            setOpen(true);
            return false;
        }
        if(data.get('name') == ""){
            setAlertMsg("닉네임을 입력해 주세요.");
            setOpen(true);
            return false;
        }
        if(data.get('password') == ""){
            setAlertMsg("비밀번호를 입력해 주세요.");
            setOpen(true);
            return false;
        }
        if(data.get('passwordConfirm') == ""){
            setAlertMsg("비밀번호 확인을 입력해 주세요.");
            setOpen(true);
            return false;
        }
        if(data.get('password') != data.get('passwordConfirm')){
            setAlertMsg("비밀번호가 일치하지 않습니다.");
            setOpen(true);
            return false;
        }

        return true;
    };

    const callSignUpApi = async (data) => {
        axios.post('/member?type=signup', {
            user_id : data.get('id'),
            user_name : data.get('name'),
            user_password : data.get('password'),
        })
        .then( response => {
            try {
                navigate("/login");
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <CssVarsProvider>
            <Typography level="h3" style={{color:theme.palette.primary.main}}>
                Good Blog
            </Typography>
            <Typography level="h5" style={{marginTop:10}}>
                회원가입
            </Typography>
            </CssVarsProvider>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="id"
                    label="아이디"
                    name="id"
                    autoComplete="id"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="name"
                    label="닉네임"
                    name="name"
                    autoComplete="name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="passwordConfirm"
                    label="비밀번호 확인"
                    type="password"
                    id="passwordConfirm"
                    autoComplete="passwordConfirm"
                    />
                </Grid>
                {open && <Grid item xs={12}>
                    <Alert variant="outlined" severity="error">
                        { alertMsg }
                    </Alert>
                </Grid>}
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained" disableElevation
                sx={{ mt: 3, mb: 2 }}
                size='large'
                >
                회원 가입
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/login" variant="body2">
                    로그인하기
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
        </ThemeProvider>
    );
}