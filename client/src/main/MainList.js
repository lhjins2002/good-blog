import * as React from 'react';
import axios from 'axios';
import { withRouter } from '../common/withRouter';
import Avatar from '@mui/joy/Avatar';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';


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
                <Card variant="outlined" sx={{ minWidth: '320px' }} key={data.post_id} style={{marginTop:16}} onClick={this.handlePostClick.bind(this, data.user_id, data.post_id)}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar alt={data.user_name} src={"/image/" + data.photo} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography level="h2" fontSize="md" sx={{ alignSelf: 'flex-start' }}>
                                {data.post_name}
                            </Typography>
                            <Typography level="body2">{reg_date}</Typography>
                        </Box>
                    </Box>
                        {data.thumbnail && <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>
                        <img
                            src={"/image/" + data.thumbnail}
                            alt=""
                        />
                        </AspectRatio> }
                        {!data.thumbnail && <div style={{height:16}}></div>}
                        <Box sx={{ display: 'flex' }}>
                        <div style={{maxHeight:42, overflow:'hidden'}}>
                            <Typography level="body2">
                                {postContent}
                            </Typography>
                        </div>
                    </Box>
                </Card>
            )
        }
        return result
    }

    render () {
        return (
            <CssVarsProvider>
                {this.state.append_MainList}
            </CssVarsProvider>
        );
    }
}

export default withRouter(MainList);