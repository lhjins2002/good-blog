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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/blog/*' element={<Blog />}>
          <Route path=':owner_id' element={<BlogList />} />
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
    </div>
  );
}

export default App;
