import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';
import { Link } from 'react-router-dom';

class BlogCategory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            owner_id: props.owner_id,
            append_BlogCategory: '',
        }
    }

    componentDidMount() {
        this.callBlogCategoryApi()
    }

    callBlogCategoryApi = async () => {
        axios.post('/blog?type=category', {
            owner_id : this.state.owner_id,
        })
        .then( response => {
            try {
                this.setState({ append_BlogCategory: this.BlogCategoryAppend(response) });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    BlogCategoryAppend = (response) => {
        let result = []
        var CategoryList = response.data
        
        for(let i=0; i<CategoryList.json.length; i++){
            var data = CategoryList.json[i]

            var category_id = data.category_id;
            var category_name = data.category_name;

            result.push(
                <ListItem key={category_id} disablePadding component={Link} style={{color:'inherit'}} to={"/blog/" + this.state.owner_id + "/" + category_id}>
                    <ListItemButton>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={category_name} />
                    </ListItemButton>
                </ListItem>
            )
        }
        return result
    }

    render () {
        return (
            <List
                subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  카테고리
                </ListSubheader>
              }
            >
                {this.state.append_BlogCategory}
            </List>
        );
    }
}

export default BlogCategory;