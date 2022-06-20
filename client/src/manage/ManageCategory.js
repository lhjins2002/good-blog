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

class ManageCategory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            columns: [{ field: 'category_name', headerName: '카테고리명', sortable: false, hideable: false},
                
            ],
            rows: [],
            modalOpen: false,
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

    callAddCategoryApi = async (data) => {
        axios.post('/manage?type=addCategory', {
            owner_id : this.state.owner_id,
            category_name : data.get('name'),
            category_order : data.get('order'),
        })
        .then( response => {
            try {
                this.callBlogCategoryApi();
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
            this.callAddCategoryApi(data);
        }

        this.setState({modalOpen : false});
    };

    render () {
        return (
            <Container>
                <Box sx={{ minWidth: 275 }} style={{marginTop:16}}>
                    <Typography variant="h5" component="div">
                        카테고리 설정
                    </Typography>
                    <div>
                        <Button variant="outlined" startIcon={<AddIcon />} style={{marginTop:16}} onClick={this.handleClickOpen}>
                            추가
                        </Button>
                    </div>
                    <TableContainer component={Paper} style={{marginTop:16}} variant="outlined">
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>순번</TableCell>
                                <TableCell>카테고리 이름</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.state.rows.map((row) => (
                                <TableRow
                                key={row.category_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.category_order}
                                    </TableCell>
                                    <TableCell>
                                        {row.category_name}
                                    </TableCell>
                                    
                                    <TableCell align="right">
                                        <IconButton aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Dialog open={this.state.modalOpen} onClose={this.handleClose}>
                    <Box component="form" noValidate onSubmit={this.handleSubmit}>
                        <DialogTitle>카테고리 추가</DialogTitle>
                        <DialogContent>
                        <DialogContentText style={{marginBottom:10}}>
                            카테고리 이름과 순번을 입력해 주세요.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="카테고리 이름"
                            type="text"
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            id="order"
                            name="order"
                            label="순번"
                            type="number"
                            fullWidth
                            variant="outlined"
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose}>취소</Button>
                        <Button type="submit">확인</Button>
                        </DialogActions>
                        </Box>
                    </Dialog>
                </Box>
            </Container>
        );
    }
}

export default ManageCategory;