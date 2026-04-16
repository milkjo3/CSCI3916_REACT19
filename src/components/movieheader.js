import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../actions/authActions";
import NavDropdown from 'react-bootstrap/NavDropdown';

function MovieHeader() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.auth.loggedIn);
    const username = useSelector((state) => state.auth.username);
    const selectedMovie = useSelector((state) => state.movie.selectedMovie);
    
    const logout = () => {
        dispatch(logoutUser());
    };

    return (
        <div>
            <Navbar expand="lg" className='custom-navbar' variant="dark">
                {loggedIn? (<Navbar.Brand as={NavLink} to="/">The Critic's Grimoire</Navbar.Brand> ) : (
                    <Navbar.Brand as={NavLink} >The Critic's Grimoire</Navbar.Brand> 
                )}
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={NavLink} to="/movielist" disabled={!loggedIn}> 
                        Movie List
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={'/movie/' + (selectedMovie? selectedMovie._id: '')} disabled={!loggedIn}>
                        Movie Detail
                    </Nav.Link>
                
                        {loggedIn? (
                            <NavDropdown align="end" title="Profile" id="basic-nav-dropdown" className='nav-dropdown' alignRight>
                                <NavDropdown.Item href="" >View Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#/signin" onClick={logout}>Logout</NavDropdown.Item>
                                <NavDropdown.Divider />
                            </NavDropdown>
                        ): (
                            <Nav.Link as={NavLink} to="/signin">
                                Login
                            </Nav.Link>
                        )}
                    
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default MovieHeader;