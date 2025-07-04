import React, { 
    useState,   // useed to track and manage states within component
    useEffect,  // hook to create "side-effects" that trigger in response to dependecy(-ies) change
    useRef,     // used to attach a 'ref' to drop-down menu it can be accessed and manipulated in DOM
    useMemo     // hook "memorizes" function results between renders (only changes when dependencies change)
    } from "react";

import { useNavigate } from "react-router-dom"; // used to programmatically navigate to a route (ex: via Javascript logic)
                                                // In contrast, <Link> is like traditional href="" in React component form.
import { useLocation } from "react-router-dom"; // use to track and get URL location data

import { debounce } from 'lodash'; // debounce logic from 'lodash' used to delay execution between functions
                                   // for a fixed time; this reduces # of request over fast multi-clicking.

import './menuCategories.css';

const CategoryButtons = ({ clearSearchBar }) => {

    const location = useLocation();                  // used to get/track path vaues from the url route
    const navigate = useNavigate();                  // initalizes navigate function
    const [menuOpen, setMenuOpen] = useState(false); // tracks when dropdown menu is open or closed
    const [selected, setSelected] = useState(null);  // tracks selection choice from header menu (or dropdown menu for small screens)

    const categories = [  // Category and path variables (stored nested in array), used to 'navigate' between categories
        {name: 'All',               path: '/products/all'               },
        {name: 'Fishes',            path: '/products/fishes'            },
        {name: 'Invertebrates',     path: '/products/invertebrates'     },
        {name: 'Corals & Anemones', path: '/products/corals_&_anemones' }
    ];

    /* Colors of category buttons (when selected/unselected) for desktop screen sizes  */
    const textColor         = '#fff';     // button text color (white)
    const selectBttnColor   = '#136196';  // button color (or 'foreground color') when selected
    const unSelectBttnColor = '#2394e0';  // button color when unselected


    const dropDownRef= useRef(null); // used for reference to dropdown menu when detecting 
                                     // clicks outside dropdown menu via useEffect()

    /* Drop-down menu option styling colors (for mobile screen sizes) */ 
    const selectedBG   = '#2394e0'; // background color of selected option 
    const unSelectedBG = 'transparent'; // background color of unselected option
    const selectedFG   = '#fff';        // text color (or 'foreground color') of selected option
    const unSelectedFG = '#000';        // text color of unselected option


    /**************************************************************************************************************/
    /********************* All functions for component ************************************************************/
    /**************************************************************************************************************/

    /* Create custom debounced navigation function */
    const debouncedNavigate = useMemo(() => // useMemo() ensures function is only created once and can be reused between renderss
        debounce((category, path) => {      // create custom debounce function
            setSelected(category);          // set current selected category
            navigate(path);                 // route to navigate to
        }, 250),                            // Delay of 250ms between function calls 
    []);                                    // ensures that 'debouncedNavigate' is only mounted once


    const handleClick = (category, path) => { // click for route naviagation
        clearSearchBar();                     // execute passed clearSearchBar() method
        debouncedNavigate(category, path);    // route parameters
        setMenuOpen(false);                   // for mobile screen, closes drop-down menu if open
    }

    const openMenu = () => { // toggles opening/closing of dropdown menu
        setMenuOpen(prev => !prev);
    }

    /**************************************************************************************************************/
    /********************* All useEffect() for component **********************************************************/
    /**************************************************************************************************************/

    useEffect(() => { // useEffect that determines current products' category from url params (and highlight appropriate button)
                      // If on another path like '/cart' instead of '/products/:catergory', NO buttons will be selected/highlighted
        const path = location.pathname;          // get current url path
        const match = categories.find(           // check if url path matches any of category paths
            (categories) => (path === categories.path)
        ); 

        setSelected(match ? match.name : null);  // Finally, if match found, set selected (otherwise 'null') 
    }, [location.pathname]);                     // dependency is the url path.


    useEffect(()=>{ // useEffect closes drop-down menu if clicked outside of drop-down menu while opened.
        const handleOutsideClick = (event) => {
            if(dropDownRef.current  // <== checks if the referred dropdown <div> exists
                && !dropDownRef.current.contains(event.target) //<== First checks if the dropdown <div> contains the click event (target).
                                                               //    Then the negation(!) makes it so the condition is that the click event 
                                                               //    takes place outside of selected dropDownRef.
            ) {
                setMenuOpen(false); // close menu
            };
        }
        document.addEventListener('mousedown', handleOutsideClick); // attaches method of 'mousedown' (or click) event

        return () => { // Cleans up event listener when component remounts or dismounts
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    },[]) // runs once on component mount



    return (
       <>
        {/* Category selection drop-down menu for mobile screen sizes */}
        <div className="custom-dropdown" ref={dropDownRef}>
            <div className="dropdown-box" onClick={openMenu}>

                {/* For screen widths of >=360px */}
                <div className="current-selection">{selected ? selected : 'Shop Products'}</div>
                {/* For screen widths of >=320px and <=359px */}
                <div className="current-selection-mobile">{selected ? selected : 'Products'}</div>

                <div className="toggle-arrow"> {menuOpen ? '▲' : '▼'} </div>
            </div>
            { menuOpen && (
                <div className="menu-options">
                    {categories.map((category, index) => (
                        <React.Fragment key={category.name}>
                            <div
                                className="option"
                                onClick={() =>  handleClick(category.name, category.path)}
                                style ={{
                                    backgroundColor: selected === category.name ? selectedBG : unSelectedBG,
                                    color:           selected === category.name ? selectedFG : unSelectedFG,
                                }}
                            >
                                {category.name}
                            </div>
                            {(index < categories.length - 1) && <div className="menu-options-divider" />} 
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>

        {/* Buttons for desktop screen size */}
        <div className="buttons-container">
            {
                categories.map(category => (
                    <button
                        key={category.name}
                        className="button"
                        onClick={() => handleClick(category.name, category.path)}
                        style={{
                            backgroundColor: selected === category.name ? selectBttnColor : unSelectBttnColor,
                            color: textColor
                        }}  
                    >
                        {category.name}
                    </button>  
                ))
            }
        </div>
       </>
    );
}

export default CategoryButtons;