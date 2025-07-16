import { useState } from 'react'
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap'
import MushroomCard from './MushroomCard'
import mushrooms from './data/mushrooms.json'

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('')

    // Filter mushrooms based on search term
    const filteredMushrooms = mushrooms.filter(mushroom =>
        mushroom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mushroom.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">Search Mushrooms</h1>
            
            {/* Search Bar */}
            <Row className="justify-content-center mb-4">
                <Col md={6}>
                    <InputGroup size="lg">
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search mushrooms by name or description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
            </Row>

            {/* Search Results Count */}
            <div className="text-center mb-3">
                <p className="text-muted">
                    {searchTerm ? `Found ${filteredMushrooms.length} mushroom(s) matching "${searchTerm}"` : `Showing all ${mushrooms.length} mushrooms`}
                </p>
            </div>

            {/* Mushroom Cards */}
            <Row>
                {filteredMushrooms.length > 0 ? (
                    filteredMushrooms.map(mushroom => (
                        <Col key={mushroom.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <MushroomCard 
                                image={mushroom.image}
                                title={mushroom.title}
                                description={mushroom.description}
                            />
                        </Col>
                    ))
                ) : (
                    <Col xs={12} className="text-center">
                        <div className="py-5">
                            <h4 className="text-muted">No mushrooms found</h4>
                            <p className="text-muted">Try adjusting your search terms</p>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    )
}