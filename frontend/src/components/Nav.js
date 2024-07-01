import React from 'react';
import { Link } from 'react-router-dom';

//keep file and component name same for ease 
const Nav= ()=>{
    return(
        <div>
            <ul className='nav-ul'>
                <li> <Link to="/">Home Page</Link> </li>
                <li> <Link to="/login">Login </Link> </li>
                <li> <Link to="/register"> Register </Link> </li>
            </ul>
        </div>
    );
}

export default Nav;