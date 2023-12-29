import './App.css';
import Login from './Content/Login/Login';
import { useState } from 'react';
import Post from './Content/Post/Post';
function App() {

  const [usertoken,setusertoken] = useState(null);
  return (
    <div className="App">
        <Login setusertoken={setusertoken} usertoken={usertoken}/>
        <Post usertoken={usertoken}/>
    </div>
  );
}

export default App;
