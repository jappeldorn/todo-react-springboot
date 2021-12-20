import React, { useState } from 'react';
import classnames from 'classnames';
import logo from '../../static/images/react-logo.png';

const Navigation = ({ user, theme }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onClickLogout = () => {
    window.location.href = '/logout'
  }

  const toggleDropDown = toggle => {
		setDropdownOpen(toggle);
	}

    return (
      <nav className={classnames('navbar navbar-light navbar-expand-lg bg-light fixed-top flex-md-nowrap p-2 mb-4 shadow', { 'bg-dark navbar-dark': theme === 'dark'})}>
          <div className='container-fluid'>
            <a className='navbar-brand col-md-3 col-lg-2 me-0 px-3' href='/#'>
                <img src={logo} alt='logo' width='30' height='30' class='d-inline-block align-text-top' /> Lorem Ipsum</a>
            <ul className='navbar-nav'>
               <li className='nav-item dropdown'>
                <a onClick={() => toggleDropDown(!dropdownOpen)} 
                  className={classnames('nav-link dropdown-toggle', { show: dropdownOpen })} 
                  href='/#' 
                  id='navbarDropdownMenuLink' 
                  role='button' 
                  data-bs-toggle='dropdown' 
                  aria-expanded={dropdownOpen}>
                  {user || 'User'}
                </a>
                <ul class={classnames('dropdown-menu user-dropdown', { show: dropdownOpen })} aria-labelledby='navbarDropdownMenuLink'>
                  <li><a onClick={() => onClickLogout()} className='dropdown-item' href='/#'>Logout</a></li>           
                </ul>
               </li>
            </ul>           
          </div>
    </nav>
    );
};

export default Navigation;