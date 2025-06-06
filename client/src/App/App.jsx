import { BrowserRouter as Router,  // provides routing functionality via browser's history API
         Routes,    // wrapper component used to group defined routes
         Route,     // component used to define a route via specifying url path and component to render when path matches
         Navigate   // used to handle redirection between routes
        } from 'react-router-dom'; // router library for creating and managing routes

import BasePageLayout from '../AppPageLayouts/BasePageLayout/BasePageLayout.jsx';   // Base Page Layout with common features for ALL pages
import PublicPageLayout    from '../AppPageLayouts/PublicPageLayout.jsx';           // page layout for public pages
import ProtectedPageLayout from '../AppPageLayouts/ProtectedPageLayout.jsx';        // page layout for protected pages

// All public pages
import ProductsPage        from '../PublicPages/ProductsPage/ProductsPage.jsx';     // 'home' page with all products
import ProductDetailsPage  from '../PublicPages/ProductDetailsPage/ProductDetailsPage.jsx'; // give product details for specific product by id
import CartPage            from '../PublicPages/CartPage/CartPage.jsx';             // dedicated cart page (fallback for slider cart, which is main)
import LoginPage           from '../PublicPages/LoginPage/LoginPage.jsx';           // login page for users to access protected pages
import RegisterPage from '../PublicPages/RegisterPage/RegisterPage.jsx';            // registration page for new users

// All protected pages
import ProfilePage from '../ProtectedPages/ProfilePage/ProfilePage.jsx'; // user profile page (only accessible after login)

const App = () => {

    return (
      <Router>
        <Routes>

          {/* Basepage layout that wraps ALL pages (both public and protected). '/' is start (and index) of all routes */}
          <Route path='/'   element={<BasePageLayout/>} >

            {/* All routes that are part of Public Page Layout */}
            <Route element={<PublicPageLayout/>}>

              {/* Redirect '/' and '/products' to '/products/all' */}
              <Route index            element={<Navigate to='/products/all'/>} />
              <Route path='/products' element={<Navigate to='/products/all'/>} />

              {/* Route for page with all */}
              <Route path='/products/all'    element={< ProductsPage />}  />

              {/* Route returns all products for specified category */}
              <Route path='/products/:category' element={<ProductsPage />} />

              {/* Routes that show product details for a given product via id */}
              <Route path='/products/:category/:id' element={<ProductDetailsPage />} />
              {/*<Route path='/products/all/:id' element={<ProductDetails />} /> */}

              {/* Dedicated cart page (fallback route for the main 'Cart Slider' overlay) */}
              <Route path='/cart' element={<CartPage />} />

              {/* Dedicated User Login page */}
              <Route path='/auth/login' element={<Navigate to='/login'/>} />
              <Route path='/login' element={<LoginPage/>} />

              {/* Dedicated User account Registration page */}
              <Route path='/auth/register' element={<Navigate to='/register'/>} />
              <Route path='/register' element={<RegisterPage/>} />
            </Route>

            {/* Protected Routes Layout */}
            <Route element={<ProtectedPageLayout />}>
              <Route path='/profile' element={<ProfilePage />} />
            </Route>

          </Route>

        </Routes>
      </Router>
    );
}

export default App;