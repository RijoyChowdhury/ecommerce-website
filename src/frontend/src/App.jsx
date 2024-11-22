import { Routes, Route } from "react-router-dom";
import Home from './views/Home';
import Cart from "./views/Cart";
import User from './views/User';
import Signup from "./views/Signup";
import Login from "./views/Login";
import ProductDetails from './views/ProductDetails';
import PageNotFound from './views/PageNotFound';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart"  element={<Cart />} />
            <Route path="/user" element={<User />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default App