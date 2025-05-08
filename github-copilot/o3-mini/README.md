# Wordbook Management Application

## Overview
The Wordbook Management Application allows users to create and manage vocabulary lists for various subjects. Users can register and manage word cards within these lists, making it a versatile tool for learning and memorization.

## Technologies Used
- **Frontend**: React, TypeScript, Vite
- **Backend**: Python (Flask)
- **Database**: MySQL
- **Containerization**: Docker, Docker Compose

## Project Structure
```
wordbook-app
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components
│   │   │   └── WordCard.tsx
│   │   └── styles
│   │       └── App.css
│   ├── package.json
│   └── vite.config.ts
├── backend
│   ├── app.py
│   ├── requirements.txt
│   ├── models.py
│   ├── routes.py
│   └── config.py
├── docker-compose.yml
├── frontend.Dockerfile
├── backend.Dockerfile
└── README.md
```

## Features
- Create and manage vocabulary lists (wordbooks).
- Add, edit, and delete word cards within each wordbook.
- Favorite word cards for quick access.
- Filter word cards by favorites.
- Sort word cards based on user-defined criteria.
- Store and display word card content in Markdown format.
- Tag word cards with user-defined tags.

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd wordbook-app
   ```

2. **Build and run the application using Docker Compose**:
   ```
   docker-compose up --build
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` for the frontend.

## Usage
- Use the home screen to view and manage your wordbooks.
- Click on a wordbook to view and manage the word cards within it.
- Use the provided functionalities to add, edit, delete, and favorite word cards.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.