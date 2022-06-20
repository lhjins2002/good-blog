import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import { withRouter } from '../common/withRouter';
import { CardHeader } from '@mui/material';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CardMedia } from '@mui/material';


class MainList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            append_MainList: '',
        }
    }

    componentDidMount() {
        this.callMainListApi()
    }

    callMainListApi = async () => {
        axios.post('/main?type=poplist', {
        })
        .then( response => {
            try {
                this.setState({ append_MainList: this.MainListAppend(response) });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handlePostClick = (user_id, post_id) => {
        this.props.navigate('/blog/' + user_id + '/' + post_id);
    }

    MainListAppend = (response) => {
        let result = []
        var mainList = response.data;
        const extractTextPattern = /(<([^>]+)>)/gi;
        
        for(let i=0; i<mainList.json.length; i++){
            var data = mainList.json[i]

            var date = data.create_dt
            var year = date.substr(0,4)
            var month = date.substr(5,2)
            var day = date.substr(8,2)
            var reg_date = year +'.'+month+'.'+day;
            var postContent = data.post_content.replace(extractTextPattern, ' ');

            result.push(
                <Box sx={{ minWidth: 275 }} key={data.post_id} style={{marginTop:16}}>
                    <Card variant="outlined" onClick={this.handlePostClick.bind(this, data.user_id, data.post_id)} >
                        <CardHeader
                            avatar={
                                <Avatar alt={data.user_name} src={"/image/" + data.photo} />
                            }
                            action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                            }
                            title={data.post_name}
                            subheader={reg_date}
                        />
                        {data.thumbnail && <CardMedia
                            component="img"
                            height="194"
                            image={"/image/" + data.thumbnail}
                            alt={data.post_name}
                        />}
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{height:40, overflow:'hidden'}}>
                                {postContent}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            )
        }
        return result
    }

    render () {
        return (
            <Container>
                 {this.state.append_MainList}
            </Container>
        );
    }
}

export default withRouter(MainList);