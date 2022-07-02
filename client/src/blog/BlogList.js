import * as React from 'react';
import { Container } from '@mui/system';
import axios from 'axios';
import { withRouter } from '../common/withRouter';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';
import CardOverflow from '@mui/joy/CardOverflow';
import Avatar from '@mui/joy/Avatar';

class BlogList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            append_BlogList: '',
            user_name: '',
            photo: '',
            introduce: '',
            back_photo: '',
        }
    }

    componentDidMount() {
        this.callProfileInfoApi();
        this.callBlogListApi()
    }

    callProfileInfoApi = async () => {
        axios.post('/blog?type=profileinfo', {
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
                <Card variant="outlined" sx={{ minWidth: 320 }} style={{marginTop:16}}>
                    <CardOverflow>
                        <AspectRatio ratio="2">
                        <img
                            src={"/image/" + this.state.back_photo} 
                            alt=""
                        />
                        </AspectRatio>
                        <Avatar alt={this.state.user_name} src={"/image/" + this.state.photo} 
                            sx={{
                                position: 'absolute',
                                zIndex: 2,
                                borderRadius: '50%',
                                left: '1rem',
                                bottom: 0,
                                transform: 'translateY(50%)',
                                width: 56, height: 56,
                            }}
                        />
                    </CardOverflow>
                    <Typography level="h2" sx={{ fontSize: 'md', mt: 5 }}>
                        {this.state.user_name}
                    </Typography>
                    <Typography level="body2" sx={{ mt: 0.5, mb: 2 }}>
                        {this.state.introduce}
                    </Typography>
                    <CardOverflow
                        variant="soft"
                        sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        px: 'var(--Card-padding)',
                        borderTop: '1px solid',
                        borderColor: 'neutral.outlinedBorder',
                        bgcolor: 'background.level1',
                        }}
                    >
                        <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                        전체글 123
                        </Typography>
                        <Box sx={{ width: 2, bgcolor: 'divider' }} />
                        <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                        조회수 456
                        </Typography>
                    </CardOverflow>
                    </Card>
                        {this.state.append_BlogList}
                </CssVarsProvider>
            </Container>
        );
    }
}

export default withRouter(BlogList);