import * as React from 'react';
import axios from 'axios';
import { withRouter } from '../common/withRouter';
import Avatar from '@mui/joy/Avatar';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from '@mui/joy/styles';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react';
import { createTheme } from '@mui/material';

class MainList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            append_MainList: [],    //사이트 전체 글 목록 배열
            limit:0,                //페이징 시작 번호
            showMore:false,         //더보기버튼 표시 여부
        }
    }

    //컴포넌트 마운팅된 후 실행
    componentDidMount() {
        this.callMainListApi()
    }

    //사이트 전체 글 가져오기
    callMainListApi = async () => {
        axios.post('/main?type=poplist', {
            limit:this.state.limit
        })
        .then( response => {
            try {
                this.MainListAppend(response);
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    //글 클릭 이벤트
    handlePostClick = (user_id, post_id) => {
        this.props.navigate('/view/' + user_id + '/' + post_id);
    }

    //프로필 이미지 클릭 이벤트
    handleProfileClick = (user_id, e) => {
        e.stopPropagation();
        this.props.navigate('/blog/' + user_id);
    }

    //글 목록 그리기
    MainListAppend = (response) => {
        let result = []
        var mainList = response.data;
        const extractTextPattern = /(<([^>]+)>)/gi;

        if(mainList.json.length < 10){
            this.setState({ showMore:false });
        }else{
            let newLimit = this.state.limit + 10;
            this.setState({ showMore:true, limit:newLimit});
        }
        
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
                        <Avatar alt={data.user_name} src={"/image/" + data.photo} onClick={this.handleProfileClick.bind(this, data.user_id)}/>
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
        
        this.setState({append_MainList : this.state.append_MainList.concat(result)});
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
            <Fragment>
                <CssVarsProvider>
                    <div style={{marginTop:30}}>
                        {this.state.append_MainList}
                    </div>
                </CssVarsProvider>
                    {this.state.showMore && <div style={{marginTop:16}}> 
                        <Button variant="outlined" component="span" startIcon={<ExpandMoreIcon />} theme={this.theme}
                        fullWidth
                        size='large'
                        onClick={this.callMainListApi}
                        >
                            더보기
                        </Button>
                    </div>}
            </Fragment>
            
        );
    }
}

export default withRouter(MainList);