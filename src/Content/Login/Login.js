import React, { useState } from "react";
import './Login.css';
import axios from "axios";

function Login(props){

    const [loading,setLoading] = useState(false);
    const [error,seterror] = useState(false);

    const {usertoken,setusertoken} = props;


    const validateuser = (e) =>{
        e.preventDefault();
        seterror(false)
        const username = document.getElementById('username').value;
        const password = document.getElementById('pass').value;
        setLoading(true)
        axios.post('https://instaapp-lac.vercel.app/validate',{Name:username,Pass:password})
        .then((response)=>{
            setLoading(false)
            if(response.data.valid)
            {
                setusertoken(response.data.account)
            }
            else{
                seterror(true);
            }
        })
        .catch((err)=>{
            console.log(err)
            setLoading(false)
            setusertoken(null)
        })
    }


    const handleLogout = () =>{
        setusertoken(null)
    }


    return(
        <div className="LoginContainer" onSubmit={validateuser}>
            {
                usertoken?
                <label className="logout" onClick={handleLogout} >Logout</label>
                :
                <>
                    <h1 className='heading'>Instagram Post App</h1>
                    <form className='form'>
                    <div className='fields'>
                        <label>Phone number, username, or email</label>
                        <input type='text' required id='username' onChange={()=>seterror(false)}/>
                    </div>
                    <div className='fields'>
                        <label>Password</label>
                        <input type='password' required id='pass' onChange={()=>{seterror(false)}}/>
                    </div>
                    
                    {
                        loading?
                        <div className="loading">
                            <label className="load1"></label>
                            <label className="load2"></label>
                            <label className="load3"></label>
                            <label className="load4"></label>
                        </div>
                        :
                        <button className='Login' type="submit">Log in</button>
                    }
                    {
                        error?
                        <label className="error">Sorry! Your credentails was incorrect check your username and password</label>
                        :
                        ''
                    }
                    </form>
                </>
                
            }
        </div>
    )
}


export default Login;