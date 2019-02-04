import React from 'react'
import {Navbar, NavItem, Icon} from 'react-materialize';
const NavbarMy = () =>
{
    return(
        <Navbar brand='Matcha' right>
            <NavItem href='/'><Icon>view_module</Icon></NavItem>
            <NavItem href='/?tmp=user'><Icon>perm_identity</Icon>User profile</NavItem>
            <NavItem href='/?tmp=changeData'><Icon>group_add</Icon>Change Data</NavItem>
            <NavItem href='/logout'><Icon>logout</Icon>Logout</NavItem>
        </Navbar>
    )
};
export default NavbarMy

