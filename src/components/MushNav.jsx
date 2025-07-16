import {Container, Nav, Navbar} from "react-bootstrap"
import {Link, Outlet} from "react-router"

export default function MushNav() {
    return (
        <div>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                    <img width="30" height="30"></img>
                    Mushroom Tracker
                    </Navbar.Brand>
                    <Nav className = "me-auto">
                        <Nav.Link as={Link} to="/browse">Browse</Nav.Link>
                        <Nav.Link as={Link} to="/search">Search</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/list">My Mushrooms</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ paddingTop: '70px' }}>
                <Outlet />
            </div>
        </div>
    )
}