import { useRef, useContext, useState, useEffect } from 'react'
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router'
import AuthContext from '../contexts/AuthContext'
import { getAllMushrooms, addSpecimenToMushroom } from '../services/mushroomService'

export default function AddMushroom() {
    const nameRef = useRef()
    const scientificNameRef = useRef()
    const imageUrlRef = useRef()
    const locationRef = useRef()
    const dateRef = useRef()
    const notesRef = useRef()
    const [authStatus] = useContext(AuthContext)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [edibility, setEdibility] = useState('')
    const [habitat, setHabitat] = useState('')
    const [privacy, setPrivacy] = useState('private')
    const [includeLocation, setIncludeLocation] = useState(false)
    const [hasGeolocation, setHasGeolocation] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    // Handle prefilled data from navigation state and set default date
    useEffect(() => {
        // Set current date as default
        if (dateRef.current) {
            const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
            dateRef.current.value = today
        }

        if (location.state?.prefillData) {
            const { 
                title, 
                scientificName, 
                edibility: prefillEdibility, 
                habitat: prefillHabitat,
                season,
                size,
                color,
                texture,
                sporeColor,
                distribution,
                growingConditions,
                culinaryUses,
                similarSpecies
            } = location.state.prefillData
            
            if (nameRef.current) nameRef.current.value = title || ''
            if (scientificNameRef.current) scientificNameRef.current.value = scientificName || ''
            setEdibility(prefillEdibility || '')
            setHabitat(prefillHabitat || '')
            
            // Store additional data for potential future use (not displayed in form but could be used for specimen matching)
            // These fields are kept for reference but aren't shown in the add form since they're species-level data
        }
    }, [location.state])

    // Redirect if not logged in
    if (!authStatus) {
        navigate('/login')
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const name = nameRef.current.value.trim()
        const scientificName = scientificNameRef.current.value.trim()
        const imageUrl = imageUrlRef.current.value.trim()
        const location = locationRef.current.value.trim()
        const date = dateRef.current.value
        const notes = notesRef.current.value.trim()
        
        // Basic validation
        if (!name || !location || !date) {
            setError('Please fill in all required fields (Name, Location, and Date).')
            return
        }

        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            // Create specimen data structure
            const specimenData = {
                id: Date.now(), // Simple ID generation
                name,
                scientificName,
                imageUrl,
                location,
                date,
                notes,
                edibility,
                habitat,
                privacy,
                includeLocation,
                hasGeolocation: includeLocation ? hasGeolocation : false,
                latitude: includeLocation && !hasGeolocation ? latitude : '',
                longitude: includeLocation && !hasGeolocation ? longitude : '',
                addedBy: authStatus.username,
                dateAdded: new Date().toISOString()
            }

            // Load existing mushrooms to check for matches (legacy code, no longer needed for new structure)
            // const existingMushrooms = JSON.parse(localStorage.getItem('userMushrooms') || '[]')
            // const existingSharedMushrooms = JSON.parse(localStorage.getItem('sharedMushrooms') || '[]')

            // Check if this is a specimen of an existing mushroom from the public database
            const publicMushrooms = getAllMushrooms()
            const mushroomMatch = publicMushrooms.find(m => 
                m.title?.toLowerCase() === name.toLowerCase() && 
                m.scientificName?.toLowerCase() === scientificName.toLowerCase()
            )

            if (mushroomMatch) {
                // This is a specimen of a public database mushroom
                const isPrivate = privacy === 'private'
                const newSpecimen = addSpecimenToMushroom(mushroomMatch.id, specimenData, isPrivate)
                
                const privacyText = isPrivate ? 'private' : 'public'
                setSuccess(`${privacyText} specimen added successfully to ${mushroomMatch.title}! ${isPrivate ? 'Only you can see this specimen.' : 'This specimen is now visible to all users.'}`)
            } else {
                // This is a completely new mushroom species not in the public database
                // For now, we'll treat it as a private specimen of an unknown species
                // In a full implementation, this could create a new mushroom entry
                setError('Mushroom species not found in database. Please select a known species or contact administrators to add new species.')
                setIsLoading(false)
                return
            }
            
            // Clear form
            nameRef.current.value = ''
            scientificNameRef.current.value = ''
            imageUrlRef.current.value = ''
            locationRef.current.value = ''
            dateRef.current.value = ''
            notesRef.current.value = ''
            setEdibility('')
            setHabitat('')
            setPrivacy('private')
            setIncludeLocation(false)
            setHasGeolocation(false)
            setLatitude('')
            setLongitude('')
            
            // Navigate to mushroom list after a short delay
            setTimeout(() => {
                navigate('/list')
            }, 1500)
            
        } catch (err) {
            setError('Failed to add mushroom. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container fluid className="mt-3 px-2 px-md-3 px-lg-4 px-xl-5">
            <style>
                {`
                .large-checkbox input[type="checkbox"] {
                    width: 1.5rem !important;
                    height: 1.5rem !important;
                    border: 2px solid #495057 !important;
                    border-radius: 0.375rem !important;
                    background-color: #ffffff !important;
                }
                .large-checkbox input[type="checkbox"]:checked {
                    background-color: #0d6efd !important;
                    border-color: #0d6efd !important;
                }
                .large-checkbox input[type="checkbox"]:focus {
                    border-color: #0d6efd !important;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
                }
                `}
            </style>
            <div className="mb-4 text-center">
                <h2 className="text-primary fw-bold">Add New Mushroom</h2>
                <p className="text-muted">Record your mushroom findings</p>
            </div>
            
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {success && <Alert variant="success" className="mb-3">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Common Name *</Form.Label>
                            <Form.Control 
                                type="text" 
                                ref={nameRef}
                                placeholder="e.g., Chanterelle, Morel, etc."
                                required
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Scientific Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                ref={scientificNameRef}
                                placeholder="e.g., Cantharellus cibarius"
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                            />
                        </Form.Group>

                        <Row className="g-2 g-md-3">
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Location Found *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        ref={locationRef}
                                        placeholder="e.g., Oak forest, Madison, WI"
                                        required
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Date Found *</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        ref={dateRef}
                                        required
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-2 g-md-3">
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Edibility</Form.Label>
                                    <Form.Select 
                                        value={edibility} 
                                        onChange={(e) => setEdibility(e.target.value)}
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                    >
                                        <option value="">Select...</option>
                                        <option value="edible">Edible</option>
                                        <option value="poisonous">Poisonous</option>
                                        <option value="unknown">Unknown</option>
                                        <option value="inedible">Inedible</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Habitat</Form.Label>
                                    <Form.Select 
                                        value={habitat} 
                                        onChange={(e) => setHabitat(e.target.value)}
                                        disabled={isLoading}
                                        size="lg"
                                        className="shadow-sm"
                                        style={{ borderColor: '#495057', borderWidth: '2px' }}
                                    >
                                        <option value="">Select...</option>
                                        <option value="deciduous">Deciduous Forest</option>
                                        <option value="coniferous">Coniferous Forest</option>
                                        <option value="mixed">Mixed Forest</option>
                                        <option value="grassland">Grassland</option>
                                        <option value="urban">Urban Area</option>
                                        <option value="wetland">Wetland</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Privacy Setting</Form.Label>
                            <Form.Select 
                                value={privacy} 
                                onChange={(e) => setPrivacy(e.target.value)}
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                            >
                                <option value="private">Private (My Collection Only)</option>
                                <option value="shared">Shared (Public Community List)</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Choose whether to share this finding with the community or keep it private
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Image URL</Form.Label>
                            <Form.Control 
                                type="url" 
                                ref={imageUrlRef}
                                placeholder="e.g., https://example.com/mushroom-photo.jpg"
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                            />
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <Form.Text className="text-muted">
                                    📸 Optional: Add a link to a photo of your mushroom finding
                                </Form.Text>
                                {includeLocation && (
                                    <Form.Check
                                        type="checkbox"
                                        label="Image has geolocation data"
                                        checked={hasGeolocation}
                                        onChange={(e) => setHasGeolocation(e.target.checked)}
                                        disabled={isLoading}
                                        className="ms-3 fw-semibold large-checkbox"
                                    />
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="🗺️ Include precise location data"
                                checked={includeLocation}
                                onChange={(e) => setIncludeLocation(e.target.checked)}
                                disabled={isLoading}
                                className="mb-3 fw-semibold large-checkbox"
                            />
                            {includeLocation && !hasGeolocation && (
                                <Row className="g-2 g-md-3">
                                    <Col xs={12} sm={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Latitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                placeholder="e.g., 43.0731"
                                                disabled={isLoading}
                                                size="lg"
                                                className="shadow-sm"
                                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Longitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                placeholder="e.g., -89.4012"
                                                disabled={isLoading}
                                                size="lg"
                                                className="shadow-sm"
                                                style={{ borderColor: '#495057', borderWidth: '2px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {includeLocation && hasGeolocation && (
                                <Alert variant="info" className="mt-2">
                                    <Alert.Heading className="h6">Using Image Geolocation</Alert.Heading>
                                    <p className="mb-0">Location data will be extracted from the image's EXIF metadata when processing.</p>
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Notes</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4}
                                ref={notesRef}
                                placeholder="Additional observations, description, conditions, etc."
                                disabled={isLoading}
                                size="lg"
                                className="shadow-sm"
                                style={{ resize: 'vertical', borderColor: '#495057', borderWidth: '2px' }}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                size="lg"
                                disabled={isLoading}
                                className="py-3 fw-semibold shadow-sm"
                                style={{ fontSize: '1.1rem' }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Adding Mushroom...
                                    </>
                                ) : (
                                    'Add Mushroom'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Container>
            )
}
