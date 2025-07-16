import { useRef } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'

export default function Login() {
    const usernameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        const username = usernameRef.current.value
        const password = passwordRef.current.value
        
        console.log('Login attempt:', { username, password })
        // Add your login logic here
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Header className="text-center">
                    <h3>Login to Mushroom Tracker</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                ref={usernameRef}
                                placeholder="Enter username"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={passwordRef}
                                placeholder="Enter password"
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" size="lg">
                                Login
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}