

import React, { useState } from 'react';
import {Container, Row, Col, Form, FormGroup, Button} from'reactstrap';
import {Link, useNavigate} from'react-router-dom';
import axios from 'axios';
import "../styles/login.css";

import loginImg from "../assets/images/login.png"
import userIcon from "../assets/images/user.png"



const Login = () => {
    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({
        email:undefined,
        password:undefined,
        });

    const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value}))
    }

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            // Make a POST request to your login API endpoint
            const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
    
            // Handle successful login (e.g., store token in localStorage, redirect user, etc.)
            console.log('Login successful', response);

            if(response.status == 200){
                localStorage.setItem("user", JSON.stringify(response.data))
                navigate('/home')
            }else{
                alert('please login with correct email and password')
            }
        } catch (error) {
            // Handle errors (e.g., display error message to user)
            console.error('Login error:', error.response.data);
        }
    };
    

  return (
  <section>
    <Container>
        <Row>
            <Col lg='8' className='m-auto'>
                <div className='login__container d-flex justify-content-between'>
                    <div className='login__img'>
                        <img src={loginImg} alt="" />
                    </div>
                    
                <div className='login__form'>
                    <div className="user">
                        <img src={userIcon} alt="" />
                    </div>
                    <h2>Login</h2>
                    
                    <Form onSubmit={handleLogin}>
                        <FormGroup>
                            <input type="email" placeholder='Email' required id='email' onChange={handleChange}/>
                        </FormGroup>
                        <FormGroup>
                            <input type="password" placeholder='Password' required id='password' onChange={handleChange}/>
                        </FormGroup>
                        <Button type='submit' className='btn secondary__btn auth__btn'>Login</Button>
                    </Form>
                    <p>Don't have an account ? 
                    <Link to='/register'>Create</Link></p>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
  </section>)
}

export default Login
