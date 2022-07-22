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
import ImageIcon from '@mui/icons-material/Image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material';

class BlogList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,   //블로그 주인 ID
            cate_id: props.cate_id,     //선택한 카테고리 ID
            append_BlogList: [],        //글 리스트 배열
            user_name: '',              //블로그 주인 닉네임
            photo: '',                  //블로그 주인 프로필 이미지
            introduce: '',              //블로그 주인 프로필 자기소개
            back_photo: '',             //블로그 주인 프로필 배경 이미지
            cate_name:'',               //선택한 카테고리명
            limit:0,                    //현재 페이징 시작 번호
            showMore:false,             //더보기 표시 여부
        }
    }

    //컴포넌트 마운트 후 실행
    componentDidMount() {
        
        if(this.state.cate_id != null){
            this.callBlogListByCategoryApi(this.state.cate_id);
            this.callCategoryNameApi(this.state.cate_id);
        }else{
            this.callProfileInfoApi();
            this.callBlogListApi();
        }
    }

    //컴포넌트 업데이트 후 실행
    componentDidUpdate(prevProps, prevState){
        if(this.props.owner_id !== prevProps.owner_id || this.props.cate_id !== prevProps.cate_id || this.state.owner_id !== prevState.owner_id){
            this.setState({ owner_id:this.props.owner_id, limit:0, append_BlogList: []});
            if(this.props.cate_id != null){
                this.callBlogListByCategoryApi(this.props.cate_id, 0);
                this.callCategoryNameApi(this.props.cate_id);
            }else{
                this.callProfileInfoApi();
                this.callBlogListApi(0);
            }
        }
    }

    //현재 블로그 주인의 프로필 정보 가져오기
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

    //현재 블로그의 전체 글 리스트 가져오기
    callBlogListApi = async (limit) => {

        if(limit != 0){
            limit = this.state.limit;
        }

        axios.post('/blog?type=list', {
            owner_id : this.state.owner_id,
            limit : limit
        })
        .then( response => {
            try {
                this.BlogListAppend(response);
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //선택한 카테고리가 있을 경우 해당 카테고리의 글만 가져오기
    callBlogListByCategoryApi = async (cate_id, limit) => {

        if(limit != 0){
            limit = this.state.limit;
        }

        axios.post('/blog?type=listbycategory', {
            owner_id : this.state.owner_id,
            cate_id : cate_id,
            limit : limit
        })
        .then( response => {
            try {
                this.BlogListAppend(response);
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //선택된 카테고리ID에 대한 카테고리 이름과 글 개수 가져오기
    callCategoryNameApi = async (cate_id) => {
        axios.post('/blog?type=categoryName', {
            cate_id : cate_id,
        })
        .then( response => {
            try {
                let categoryName = response.data.json[0].category_name;
                let cnt = response.data.json[0].cnt;
                let cateDisplay = categoryName + '(' + cnt + ')';
                this.setState({ cate_name: cateDisplay });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //조회페이지 이동 이벤트
    handlePostClick = (post_id) => {
        this.props.navigate('/view/' + this.state.owner_id + '/' + post_id);
    }

    //글 리스트 그리기
    BlogListAppend = (response) => {
        let result = []
        var blogList = response.data;
        const extractTextPattern = /(<([^>]+)>)/gi;

        if(blogList.json.length < 10){
            this.setState({ showMore:false });
        }else{
            let newLimit = this.state.limit + 10;
            this.setState({ showMore:true, limit:newLimit});
        }
        
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
                                    {reg_date}{!this.props.cate_id && ' | ' + data.category_name}
                                </Typography>
                                <Typography level="body2" style={{maxHeight:42,overflow:'hidden'}}>
                                    {postContent}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
            )
        }

        this.setState({append_BlogList : this.state.append_BlogList.concat(result)});

    }

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
                <CssVarsProvider>
                {!this.props.cate_id &&
                    <Card variant="outlined" sx={{ minWidth: 320 }} style={{marginTop:30}}>
                        <CardOverflow>
                            <AspectRatio ratio="2">
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
                    }
                    {this.props.cate_id &&
                        <div style={{marginTop:30}}>
                            <Typography level="h4" component="div">
                                {this.state.cate_name}
                            </Typography>
                        </div>
                    }
                    <div style={{marginTop:30}}> 
                    {this.state.append_BlogList}
                    </div>  
                    
                </CssVarsProvider>
                {this.state.showMore && <div style={{marginTop:16}}> 
                    <Button variant="outlined" component="span" startIcon={<ExpandMoreIcon />} theme={this.theme}
                    fullWidth
                    size='large'
                    onClick={this.callBlogListApi}
                    >
                        더보기
                    </Button>
                </div>}
            </Container>
        );
    }
}

export default withRouter(BlogList);