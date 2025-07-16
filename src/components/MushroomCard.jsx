import { Card } from 'react-bootstrap'

export default function MushroomCard({ image, title, description }) {
    return (
        <Card style={{ width: '18rem', margin: '1rem' }}>
            <Card.Img 
                variant="top" 
                src={image || "https://via.placeholder.com/300x200?text=No+Image"} 
                alt={title || "Mushroom"}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title>{title || "Unknown Mushroom"}</Card.Title>
                {description && (
                    <Card.Text>{description}</Card.Text>
                )}
            </Card.Body>
        </Card>
    )
}