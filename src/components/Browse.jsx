import { Container, Row, Col } from 'react-bootstrap'
import MushroomCard from './MushroomCard'
import mushrooms from './data/mushrooms.json'

export default function Browse() {
    // Sample mushroom data

    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">Browse Mushrooms</h1>
            <Row>
                {mushrooms.map(mushroom => (
                    <Col key={mushroom.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <MushroomCard 
                            image={mushroom.image}
                            title={mushroom.title}
                            description={mushroom.description}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}