import * as React from 'react';
import { Container } from '@mui/system';
import axios from 'axios';
import { withRouter } from '../common/withRouter';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';

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
                    <Card key={data.post_id} style={{marginTop:16}}
                    variant="outlined" onClick={this.handlePostClick.bind(this, data.post_id)}
                    row
                    sx={{
                        minWidth: '320px',
                        gap: 2,
                        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                    }}
                    >
                        {data.thumbnail && <AspectRatio ratio="1" sx={{ minWidth: 90 }}>
                            <img
                            src={"/image/" + data.thumbnail}
                            alt=""
                            />
                        </AspectRatio> }
                        <Box>
                            <Box sx={{ ml: 0.5 }}>
                                <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
                                    {data.post_name}
                                </Typography>
                                <Typography fontSize="sm" aria-describedby="card-description" mb={1} sx={{ color: 'text.tertiary' }}>
                                    {reg_date}
                                </Typography>
                                <Typography level="body2" style={{maxHeight:42,overflow:'hidden'}}>
                                    {postContent}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
            )
        }
        return result
    }

    render () {
        return (
            <Container>
                <CssVarsProvider>
                        {this.state.append_BlogList}
                </CssVarsProvider>
            </Container>
        );
    }
}

export default withRouter(BlogList);