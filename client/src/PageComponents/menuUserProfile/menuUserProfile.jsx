import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faRightToBracket, faUserLarge, faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';

import { clearUser } from "../../Slices/authSlice";
import { clearCart } from "../../Slices/cartSlice";

import './menuUserProfile.css';

const ProfileButton = () => { /* Button that toggles between default 'Login' button 
                                 OR the 'Profile' button if logged in */

    const user            = useSelector((state) => state.auth.user); // Get existing user from redux
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // checks if user is authenticated

    const dispatch = useDispatch(); // initialize dispatch of redux actions
    const navigate = useNavigate(); // initialize for route navigation

    const [showDropDown, setShowDropDown] = useState(false);// toggles dropdown depending on login
    const [error, setError] = useState(''); // tracks error

    const handleLogout = async () => {

      setError('');
      try {

        await axios.get( 
          'http://localhost:5000/auth/logout', // logout endpoint (get)
          {withCredentials: true} // tell browser that if there's a cookie (httpOnly cookie with JWT),
                                  // add to request header when sending any HTTP request to backend.
        );

        dispatch(clearUser()); // clear user from redux state
        dispatch(clearCart()); // clears cart from redux state
        localStorage.removeItem('cartState'); // as precaution, also clear 'cartState' from localStorage

        navigate('/login');    // navigate back to login
      }
      catch(err) { // catch error if issue while logging out
        setError(err);
        console.log('Error while logging out: ', error);
      }
    }

    const toggleDropDown = () => { // toggles dropdown menu
      setShowDropDown(prev => !prev);
    }

    const dropDownRef= useRef(null); // used for reference to dropdown menu when detecting 
                                     // clicks outside of dropdown menu via useEffect()

    useEffect(()=>{ // useEffect closes drop-down menu if clicked outside of drop-down menu while opened.

      if (!showDropDown) return;

      const handleClickingOutside = (event) => {

        // Below condition checks if referred dropdown <div> exists, and if it contains click event (target).
        // Negation(!) makes it so the condition is that the click takes place outside of selected dropDownRef.
        if(dropDownRef.current && !dropDownRef.current.contains(event.target)) {
           setShowDropDown(false); // close menu
          };
      }

      document.addEventListener('mousedown', handleClickingOutside); // attaches method of 'mousedown' (or click) event
    
      return () => { // Cleans up event listener when component remounts or dismounts
        document.removeEventListener('mousedown', handleClickingOutside);
      }
    },[showDropDown]) // runs when 'showDropDown' changes
    


    if(!isAuthenticated) { // if unauthenticated, button links to login page
      return (
        <div 
          className='profile-bttn-container' 
          onClick={() => navigate('/login')}
          role='button'
          tabIndex={0}  
        >
          <FontAwesomeIcon icon={faRightToBracket} className='user-icon' />
        </div>
      );
    }


    if(isAuthenticated) { // otherwise, if authenticated...   
      return (
        // Wrapper that holds BOTH profile button and dropdown menu
        <div className="profile-button-dropdown-wrapper" ref={dropDownRef}>

          {/* Profile button */}
          <div className={`profile-bttn-container ${showDropDown ? 'active' : ''}`} 
              onClick={toggleDropDown} 
              role='button'
              tabIndex={0}  
          >
            <FontAwesomeIcon icon={faUserLarge} className='user-icon' />
          </div>

          {/* Dropdown menu that shows when use clicks on 'Profile' button */}
          <div className={`dropdown-menu ${showDropDown ? 'active' : ''}`}>

            {/* #1: Display username handle when logged in */}
            <div className="dropdown-item" style={{color: '#7E7E7E'}}>@{user.username}</div>

            <div className="item-divider" />

            {/* #2: Link to user's profile */}
            <div className="dropdown-item" onClick={() => { setShowDropDown(false); navigate("/profile"); }}>
              Profile
            </div>

            <div className="item-divider" />

            {/* #3: Link to order history for user */}
            <div className="dropdown-item" onClick={() => { setShowDropDown(false); navigate("/orders");}}>
              Orders
            </div>
            <div className="item-divider" />

            {/* #4: Link for logging out */}
            <div className="dropdown-item" onClick={handleLogout}
              //style={{backgroundColor: `${loggingOut ? '#cfcfcf':'' }`}}  
            >
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </div>

          </div>
        </div>
      );
    }
}

export default ProfileButton;