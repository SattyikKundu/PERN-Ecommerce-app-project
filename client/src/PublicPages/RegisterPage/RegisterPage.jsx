
import {useState} from "react";                 // track local states
import axios from "axios";                      // used to send HTTP requests to backend
import { useNavigate } from "react-router-dom"; // used to progammatically redirecting routes
import { ErrorMessageToast } from "../../utils/utilityFunctions";

import FooterBottom from "../../PageComponents/footerBottom/footerBottom";
import PasswordInput from "../../PageComponents/loginRegisterPswdInput/passwordInput";

import './RegisterPage.css';

const RegisterPage = () => {

    const navigate = useNavigate(); // initialize Navigate

    const [formData, setFormData] = useState({ // tracks form fields in 1 useState
        username: "",
        email:    "",
        password: ""
    });

    const [registering, setRegistering] = useState(false);            // tracks if registering is ongoing
    const [header, setHeader]           = useState('Create Account'); // tracks header


    const handleChange = (event) => { // tracks form state (for all fields) as user types
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }
    
    const handleRegisterSubmit = async (event) => {// Handle registration form submission

        event.preventDefault(); // prevent page reload on submission
        setRegistering(true);   // registering starts now

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/register', // register route path
                formData,                              // form data sent to '/auth/register/' route in backend
                {
                    withCredentials: true,                // if httpOnly cookie (with JWT) exists, send to backend
                    validateStatus: (status) => status >= 200 && status < 300 // default for Axios (ensures that successful
                                                                              //  message won't enter the catch block)
                }
            );

            navigate( // redirect to '/login' route after successful registration
                '/login', 
                 { state: { successMsg: 'Registration successful!', loginHeader: "You can log in now!" }}
            );
            
        }
        catch (error) { // Handle registration failure

            // error messages come from registerUser() from 'authController.js' in '/server' backend
            const errorMessage = error.response?.data?.error || 'Registration failed.'; 

            /* Below modifies header message to show error (NOTE: holding entire updated header 
             * in useState() helps PREVENT synchronization issues that would otherwise show 
             * if using ternary operators OR holding seprarate sentence parts in separate useStates.)
             */
            setHeader( 
              <span>
                <span style={{ color: 'red'}}>{errorMessage} </span> Try again.
              </span>
            );

            ErrorMessageToast(errorMessage, 1100, 'top-center'); // error toast
        }
        finally { // end of registering
            setRegistering(false);;
        }
    }

    const clickToLoginPage = () => { // navigate to login page (if already have account)
        navigate('/login');
    }

    return (
      <>
      <div className="registration-page-full" data-bg-var-repaint>
        <div className="registration-form">

            {/* Register form header */}
            <h2>{header}</h2>

            {/* start of account registration form fields*/}
            <label>
                Username: 
                <input
                    type='text'                       // set input type
                    placeholder="Enter your username" // instruction text
                    name='username'
                    value={formData.username}         // holds 'username' value
                    onChange={handleChange}           // changes 'username' as typed
                    required                          // mandatory field
                />
            </label>
            <div className="form-divider"/>
            <label>
                Email:
                <input
                    type='text'                    // set input type
                    placeholder="Enter your email" // instruction text
                    name='email'
                    value={formData.email}         // holds 'username' value
                    onChange={handleChange}        // change password value on typing
                    required                       // makes field required
                />
            </label>            
            <div className="form-divider"/>
            <label>
              Password:
              <PasswordInput
                value      ={formData.password}     // visible password in field as typed
                onChange   ={handleChange}          // updates password in local state as typed
                name       ={"password"}            // input field name
                placeholder={"Enter your password"} // placeholder for dield
              />
            </label>              
            <div className="form-divider"/>
            <button 
                className="register-button"
                type='submit'                   // state button is 'submit' type
                disabled={registering}          // disabled whilst registering
                onClick={handleRegisterSubmit} 
            >
                {registering ? "Registering account..." : "Register"}
            </button>

            {/* Google OAuth register (and login) button */}
            <button 
                className="register-button"
                onClick={() => window.location.href = "http://localhost:5000/auth/google"}   
            >
              Register/Login with Google
            </button>

            {/* Link for users who already have an account */}
            <p style={{cursor:'default'}}>Already have an account? <span
                    onClick={()=>clickToLoginPage()}
                    style={{
                        fontWeight:'bold',
                        cursor:'pointer'
                    }}
                >
                 Login here
                </span>
            </p>
        </div>
      <FooterBottom />
      </div>
    </>
    );
}

export default RegisterPage;

