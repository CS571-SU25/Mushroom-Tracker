import detailedMushrooms from '../components/data/detailedMushrooms.json'
import { isLoggedIn } from './authService'

// Initialize the public database with detailed mushrooms data
export const initializePublicDatabase = () => {
    // Check if the public database is already initialized
    const existingData = localStorage.getItem('publicMushroomDatabase')
    
    if (!existingData) {
        // Initialize with detailed mushrooms data, adding specimens array to each
        const initialData = detailedMushrooms.map(mushroom => ({
            ...mushroom,
            specimens: [] // Array to hold public specimens
        }))
        
        localStorage.setItem('publicMushroomDatabase', JSON.stringify(initialData))
        console.log('Public mushroom database initialized with', initialData.length, 'mushrooms')
    }
    
    // Always return the current database state
    return JSON.parse(localStorage.getItem('publicMushroomDatabase') || '[]')
}

// Initialize private database for user's private specimens
export const initializePrivateDatabase = () => {
    const existingData = localStorage.getItem('privateMushroomSpecimens')
    
    if (!existingData) {
        // Initialize empty private database - stores specimens by mushroom ID
        localStorage.setItem('privateMushroomSpecimens', JSON.stringify({}))
        console.log('Private specimen database initialized')
    }
    
    return JSON.parse(localStorage.getItem('privateMushroomSpecimens') || '{}')
}

// Get all mushrooms from the public database
export const getAllMushrooms = () => {
    const data = localStorage.getItem('publicMushroomDatabase')
    
    // If no data exists, initialize the database first
    if (!data) {
        return initializePublicDatabase()
    }
    
    return JSON.parse(data)
}

// Get private specimens for current user
export const getPrivateSpecimens = () => {
    const data = localStorage.getItem('privateMushroomSpecimens')
    
    if (!data) {
        return initializePrivateDatabase()
    }
    
    return JSON.parse(data)
}

// Get all mushrooms including user data (combines public + private specimens for display)
export const getAllMushroomsWithUserData = () => {
    // Get mushrooms from public database (includes public specimens)
    const publicMushrooms = getAllMushrooms()
    
    // Only include private specimens if user is logged in
    if (!isLoggedIn()) {
        // Return only public data for non-logged-in users
        return publicMushrooms.map(mushroom => ({
            ...mushroom,
            allSpecimens: mushroom.specimens, // Only public specimens
            publicSpecimens: mushroom.specimens,
            privateSpecimens: [] // No private specimens for non-logged-in users
        }))
    }
    
    // Get private specimens only if user is logged in
    const privateSpecimens = getPrivateSpecimens()
    
    // Combine public mushrooms with private specimens for logged-in users
    const combinedMushrooms = publicMushrooms.map(mushroom => {
        const privateSpecs = privateSpecimens[mushroom.id] || []
        
        return {
            ...mushroom,
            allSpecimens: [...mushroom.specimens, ...privateSpecs], // Combined for display
            publicSpecimens: mushroom.specimens, // Keep track of public ones
            privateSpecimens: privateSpecs // Keep track of private ones
        }
    })
    
    return combinedMushrooms
}

// Get a single mushroom by ID with all specimens
export const getMushroomById = (id) => {
    const publicMushrooms = getAllMushrooms()
    const mushroom = publicMushrooms.find(m => m.id === parseInt(id))
    
    if (!mushroom) {
        console.warn(`Mushroom with ID ${id} not found`)
        return null
    }
    
    // Only add private specimens if user is logged in
    if (!isLoggedIn()) {
        return {
            ...mushroom,
            allSpecimens: mushroom.specimens, // Only public specimens
            publicSpecimens: mushroom.specimens,
            privateSpecimens: [] // No private specimens for non-logged-in users
        }
    }
    
    // Add private specimens to the mushroom for logged-in users
    const privateSpecimens = getPrivateSpecimens()
    const privateSpecs = privateSpecimens[mushroom.id] || []
    
    return {
        ...mushroom,
        allSpecimens: [...mushroom.specimens, ...privateSpecs],
        publicSpecimens: mushroom.specimens,
        privateSpecimens: privateSpecs
    }
}

// Search mushrooms by term (searches public database)
export const searchMushrooms = (searchTerm) => {
    const mushrooms = getAllMushrooms()
    const term = searchTerm.toLowerCase()
    
    return mushrooms.filter(mushroom =>
        mushroom.title.toLowerCase().includes(term) ||
        mushroom.description.toLowerCase().includes(term) ||
        (mushroom.scientificName && mushroom.scientificName.toLowerCase().includes(term)) ||
        (mushroom.edibility && mushroom.edibility.toLowerCase().includes(term)) ||
        (mushroom.habitat && mushroom.habitat.toLowerCase().includes(term))
    )
}

// Search all mushrooms including private specimens
export const searchAllMushrooms = (searchTerm) => {
    const allMushrooms = getAllMushroomsWithUserData()
    const term = searchTerm.toLowerCase()
    
    return allMushrooms.filter(mushroom =>
        mushroom.title.toLowerCase().includes(term) ||
        mushroom.description.toLowerCase().includes(term) ||
        (mushroom.scientificName && mushroom.scientificName.toLowerCase().includes(term)) ||
        (mushroom.edibility && mushroom.edibility.toLowerCase().includes(term)) ||
        (mushroom.habitat && mushroom.habitat.toLowerCase().includes(term))
    )
}

// Add a specimen to a mushroom (public or private based on privacy setting)
export const addSpecimenToMushroom = (mushroomId, specimenData, isPrivate = true) => {
    const parsedId = parseInt(mushroomId)
    
    // Create the specimen submission object
    const specimenSubmission = {
        id: Date.now(),
        mushroomId: parsedId,
        imageUrl: specimenData.imageUrl || '',
        location: specimenData.location || '',
        date: specimenData.date || new Date().toISOString().split('T')[0],
        notes: specimenData.notes || '',
        findDate: specimenData.date || new Date().toISOString().split('T')[0],
        addedBy: specimenData.addedBy || 'Anonymous',
        dateAdded: new Date().toISOString(),
        latitude: specimenData.latitude || '',
        longitude: specimenData.longitude || '',
        hasGeolocation: specimenData.hasGeolocation || false,
        privacy: isPrivate ? 'private' : 'public'
    }
    
    if (isPrivate) {
        // Add to private database
        const privateSpecimens = getPrivateSpecimens()
        
        if (!privateSpecimens[parsedId]) {
            privateSpecimens[parsedId] = []
        }
        
        privateSpecimens[parsedId].push(specimenSubmission)
        localStorage.setItem('privateMushroomSpecimens', JSON.stringify(privateSpecimens))
        
    } else {
        // Add to public database
        const publicMushrooms = getAllMushrooms()
        const mushroomIndex = publicMushrooms.findIndex(m => m.id === parsedId)
        
        if (mushroomIndex !== -1) {
            if (!publicMushrooms[mushroomIndex].specimens) {
                publicMushrooms[mushroomIndex].specimens = []
            }
            
            publicMushrooms[mushroomIndex].specimens.push(specimenSubmission)
            localStorage.setItem('publicMushroomDatabase', JSON.stringify(publicMushrooms))
        }
    }
    
    return specimenSubmission
}

// Get specimens for a specific mushroom (combines public and private)
export const getSpecimensForMushroom = (mushroomId) => {
    const parsedId = parseInt(mushroomId)
    
    // Get public specimens
    const publicMushrooms = getAllMushrooms()
    const mushroom = publicMushrooms.find(m => m.id === parsedId)
    const publicSpecimens = mushroom?.specimens || []
    
    // Only get private specimens if user is logged in
    if (!isLoggedIn()) {
        return {
            public: publicSpecimens,
            private: [], // No private specimens for non-logged-in users
            all: publicSpecimens // Only public specimens
        }
    }
    
    // Get private specimens for logged-in users
    const privateSpecimens = getPrivateSpecimens()
    const privateSpecs = privateSpecimens[parsedId] || []
    
    return {
        public: publicSpecimens,
        private: privateSpecs,
        all: [...publicSpecimens, ...privateSpecs]
    }
}

// Get all user's specimens across all mushrooms
export const getAllUserSpecimens = (username) => {
    const privateSpecimens = getPrivateSpecimens()
    const publicMushrooms = getAllMushrooms()
    
    let userSpecimens = []
    
    // Get user's private specimens
    Object.entries(privateSpecimens).forEach(([mushroomId, specimens]) => {
        const mushroom = publicMushrooms.find(m => m.id === parseInt(mushroomId))
        if (mushroom) {
            specimens.forEach(specimen => {
                if (!username || specimen.addedBy === username) {
                    userSpecimens.push({
                        ...specimen,
                        mushroomTitle: mushroom.title,
                        mushroomScientificName: mushroom.scientificName,
                        mushroomId: mushroom.id
                    })
                }
            })
        }
    })
    
    // Get user's public specimens
    publicMushrooms.forEach(mushroom => {
        if (mushroom.specimens) {
            mushroom.specimens.forEach(specimen => {
                if (!username || specimen.addedBy === username) {
                    userSpecimens.push({
                        ...specimen,
                        mushroomTitle: mushroom.title,
                        mushroomScientificName: mushroom.scientificName,
                        mushroomId: mushroom.id
                    })
                }
            })
        }
    })
    
    return userSpecimens.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
}

// Legacy functions to maintain compatibility
export const addMushroom = (mushroomData) => {
    // For now, redirect to adding a specimen to an existing mushroom
    // This could be expanded to add entirely new mushroom species to the public database
    console.warn('addMushroom is deprecated, use addSpecimenToMushroom instead')
    return null
}

export const updateMushroom = (id, updates) => {
    // This could be used to update mushroom metadata in the public database
    console.warn('updateMushroom not implemented in new structure')
    return null
}

export const deleteMushroom = (id) => {
    // This could be used to remove mushrooms from public database (admin function)
    console.warn('deleteMushroom not implemented in new structure')
    return []
}
