import Main from './main/Main';
import Blog from './blog/Blog';
import Login from './member/Login';
import SignUp from './member/SignUp';
import { Route, Routes } from "react-router-dom";
import BlogList from './blog/BlogList';
import BlogView from './blog/BlogView';
import ManageCategory from './manage/ManageCategory'
import ManagePost from './manage/ManagePost'
import ManageBlog from './manage/ManageBlog';
import ManageProfile from './manage/ManageProfile';
import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

function App() {

  const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        axios.interceptors.request.use(function (config) {
            // 로딩 호출
            setIsLoading(true);
            return config;
        }, function (error) {
            // 실패 시 로딩창 종료
            setIsLoading(false);
            return Promise.reject(error);
        })
        axios.interceptors.response.use((config) => {
            // 완료 시 로딩창 종료
            setIsLoading(false);
            return config;
        },(error) => {
            // 실패 시 로딩창 종료
            setIsLoading(false);
            return Promise.reject(error)
        })
    }, [])


  return (
    <div className="App">
        {isLoading && <CircularProgress sx={{position:'fixed', left:'calc(50% - 20px)', top:'calc(50% - 20px)', zIndex:1000}} />}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/blog/*' element={<Blog />}>
          <Route path=':owner_id' element={<BlogList />} />
          <Route path=':owner_id/:cate_id' element={<BlogList />} />
        </Route>
        <Route path='/view/*' element={<Blog />}>
          <Route path=':owner_id/:post_id' element={<BlogView />} />
        </Route>
        <Route path='/manage/*' element={<Blog />}>
          <Route path='' element={<ManageBlog />} />
          <Route path='category' element={<ManageCategory />} />
          <Route path='post' element={<ManagePost />} />
          <Route path='profile' element={<ManageProfile />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
      <div style={{height:100}}></div>
    </div>
  );
}

export default App;
