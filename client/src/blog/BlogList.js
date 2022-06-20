import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import axios from 'axios';
import { Box } from '@mui/material';
import { withRouter } from '../common/withRouter';

class BlogList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            append_BlogList: '',
        }
    }

    componentDidMount() {
        this.callBlogListApi()
    }

    callBlogListApi = async () => {
        axios.post('/blog?type=list', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                this.setState({ append_BlogList: this.BlogListAppend(response) });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    handlePostClick = (post_id) => {
        this.props.navigate('/blog/' + this.state.owner_id + '/' + post_id);
    }

    BlogListAppend = (response) => {
        let result = []
        var blogList = response.data;
        const extractTextPattern = /(<([^>]+)>)/gi;
        
        for(let i=0; i<blogList.json.length; i++){
            var data = blogList.json[i];

            var date = data.create_dt
            var year = date.substr(0,4)
            var month = date.substr(5,2)
            var day = date.substr(8,2)
            var reg_date = year +'.'+month+'.'+day
            var postContent = data.post_content.replace(extractTextPattern, ' ');

            result.push(
                <Box sx={{ minWidth: 275 }} key={data.post_id} style={{marginTop:16}}>
                    <Card variant="outlined" onClick={this.handlePostClick.bind(this, data.post_id)}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {reg_date}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {data.post_name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {data.user_name}
                            </Typography>
                            <Typography variant="body2">
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
                 {this.state.append_BlogList}
            </Container>
        );
    }
}

export default withRouter(BlogList);