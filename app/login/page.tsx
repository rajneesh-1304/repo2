'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='register_formm'>
        <h1 className="head">Login!</h1>
        <p className="sign">Get access to your Orders, Wishlist and Recommendations</p>
        <img className='logo' src="https://cdn.brandfetch.io/idWdImNSUt/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="" />
      </div>
      <div className='login_form'>
        <h1 className='login_heading'>Login</h1>
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login