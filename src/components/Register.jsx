import { useRef, useContext, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router'
import AuthContext from '../contexts/AuthContext'
import { registerUser, authenticateUser } from '../services/authService'

export default function Register() {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const emailRef = useRef()
    const [authStatus, setAuthStatus] = useContext(AuthContext)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const username = usernameRef.current.value.trim()
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value
        const email = emailRef.current.value.trim()
        
        // Basic validation
        if (!username || !password || !email) {
            setError('Please fill in all required fields.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Register the user using the authentication service
            const userData = {
                username: username,
                password: password,
                email: email
            }
            
            // Register user (this will check for duplicates)
            registerUser(userData)
            
            // Automatically log them in after successful registration
            const authData = authenticateUser(username, password)
            setAuthStatus(authData)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // If already logged in, redirect to home
    if (authStatus) {
        navigate('/')
        return null
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Header className="text-center">
                    <h3>Register for Mushroom Tracker</h3>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                ref={usernameRef}
                                placeholder="Choose a username"
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                ref={emailRef}
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={passwordRef}
                                placeholder="Create a password"
                                required
                                disabled={isLoading}
                            />
                            <Form.Text className="text-muted">
                                Must be at least 6 characters long.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={confirmPasswordRef}
                                placeholder="Confirm your password"
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <div className="d-grid mb-3">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </div>

                        <div className="text-center">
                            <small>
                                Already have an account? <Link to="/login">Login here</Link>
                            </small>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
