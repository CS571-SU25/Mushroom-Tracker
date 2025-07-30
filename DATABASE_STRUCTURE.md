# Mushroom Tracker Database Structure

## Overview
The application now uses a two-database system with localStorage to manage mushroom data, plus sessionStorage for user authentication:

### 1. Public Database (`publicMushroomDatabase`)
- **Purpose**: Contains the core mushroom species data from the JSON file + public specimens
- **Storage**: localStorage (persistent)
- **Storage Key**: `publicMushroomDatabase`
- **Structure**: 
```json
[
  {
    "id": 1,
    "title": "Oyster Mushroom",
    "scientificName": "Pleurotus ostreatus",
    "description": "...",
    "edibility": "edible",
    "habitat": "deciduous trees",
    "specimens": [
      {
        "id": 1234567890,
        "mushroomId": 1,
        "imageUrl": "user-image-url.jpg",
        "location": "Central Park",
        "date": "2025-07-29",
        "notes": "Found on fallen oak",
        "findDate": "2025-07-29",
        "addedBy": "username",
        "dateAdded": "2025-07-29T10:30:00.000Z",
        "privacy": "public"
      }
    ]
  }
]
```

### 2. Private Database (`privateMushroomSpecimens`)
- **Purpose**: Stores user's private specimens linked to public mushroom IDs
- **Storage**: localStorage (persistent)
- **Storage Key**: `privateMushroomSpecimens`
- **Structure**:
```json
{
  "1": [
    {
      "id": 1234567891,
      "mushroomId": 1,
      "imageUrl": "private-image-url.jpg",
      "location": "My backyard",
      "date": "2025-07-29",
      "notes": "Found near compost pile",
      "findDate": "2025-07-29",
      "addedBy": "username",
      "dateAdded": "2025-07-29T11:15:00.000Z",
      "privacy": "private"
    }
  ],
  "2": [ /* specimens for mushroom ID 2 */ ]
}
```

### 3. User Authentication Database (`registeredUsers`)
- **Purpose**: Stores registered user accounts for authentication
- **Storage**: localStorage (persistent across sessions)
- **Storage Key**: `registeredUsers`
- **Structure**:
```json
[
  {
    "username": "demo",
    "password": "password",
    "email": "demo@example.com",
    "registeredDate": "2025-07-30T10:00:00.000Z"
  }
]
```

### 4. Session Storage (`mushroomTrackerAuth`)
- **Purpose**: Stores current user session data
- **Storage**: sessionStorage (persists until browser closes or logout)
- **Storage Key**: `mushroomTrackerAuth`
- **Structure**:
```json
{
  "username": "demo",
  "email": "demo@example.com",
  "token": "session-1722337200000",
  "loginTime": "2025-07-30T10:00:00.000Z"
}
```

## Key Features

### Specimen Submission Object
Each specimen contains:
- `id`: Unique timestamp-based ID
- `mushroomId`: Links to the public mushroom species
- `imageUrl`: User's photo of their find
- `location`: Where they found it
- `date`/`findDate`: When they found it
- `notes`: User's observations
- `addedBy`: Username who submitted it
- `dateAdded`: When it was added to the system
- `privacy`: "public" or "private"

### Privacy Control
- **Public specimens**: Added to the public database, visible to all users
- **Private specimens**: Stored separately, only visible to the user who added them

### Authentication System
- **Persistent Login**: Users remain logged in until they explicitly logout
- **Duplicate Prevention**: Registration checks for existing usernames
- **Session Management**: Uses sessionStorage for current session, localStorage for user accounts
- **Auto-login**: Users are automatically logged in after successful registration

### Data Flow
1. User adds a specimen through the form
2. System matches mushroom by name and scientific name
3. Based on privacy setting:
   - **Private**: Adds to `privateMushroomSpecimens[mushroomId]`
   - **Public**: Adds to public mushroom's `specimens` array
4. Display combines both public and private specimens for the current user

## API Functions

### Core Functions
- `initializePublicDatabase()`: Loads JSON data into public database
- `initializePrivateDatabase()`: Creates empty private specimen storage
- `getAllMushrooms()`: Gets all mushrooms from public database
- `getAllMushroomsWithUserData()`: Combines public mushrooms with user's private specimens
- `addSpecimenToMushroom(id, data, isPrivate)`: Adds specimen to appropriate database
- `getSpecimensForMushroom(id)`: Gets all specimens (public + private) for a mushroom

### Authentication Functions
- `initializeUserDatabase()`: Initializes user accounts database with demo users
- `registerUser(userData)`: Registers new user, throws error if username exists
- `authenticateUser(username, password)`: Logs in user and creates session
- `getCurrentSession()`: Gets current user session from sessionStorage
- `logoutUser()`: Removes user session
- `isLoggedIn()`: Checks if user has active session
- `userExists(username)`: Checks if username is already registered

### Legacy Support
- Old functions maintained for backward compatibility but redirect to new system
- Gradual migration path from old user storage to new structure
