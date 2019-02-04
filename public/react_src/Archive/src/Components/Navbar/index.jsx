import React from 'react'
import {Navbar, NavItem, Icon} from 'react-materialize';
const NavbarMy = () =>
{
    return(
        <Navbar brand='Matcha' right>
            <NavItem href='/'><Icon>view_module</Icon></NavItem>
            <NavItem href='/forum'><Icon>forum</Icon>Forum</NavItem>
            <NavItem href='/signin'><Icon>perm_identity</Icon>Sign In</NavItem>
            <NavItem href='/signup'><Icon>group_add</Icon>Sign Up</NavItem>
            <NavItem href='/logout'><Icon>logout</Icon>Logout</NavItem>
        </Navbar>
    )
};
export default NavbarMy

