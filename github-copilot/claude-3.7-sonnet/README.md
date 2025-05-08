# Vocabulary Manager

## Overview
Vocabulary Manager is a web application that allows users to create and manage vocabulary lists for various subjects. Users can create flashcards within these lists to enhance their learning experience.

## Technologies Used
- **Frontend**: React, TypeScript, Vite
- **Backend**: Python (Flask)
- **Database**: MySQL
- **Containerization**: Docker, Docker Compose

## Project Structure
```
vocabulary-manager
├── frontend
│   ├── public
│   ├── src
│   ├── .eslintrc.js
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend
│   ├── api
│   ├── tests
│   ├── .flaskenv
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
├── database
│   ├── migrations
│   └── init.sql
├── docker
│   ├── backend
│   ├── frontend
│   └── database
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Setup
1. Clone the repository:
   ```
   git clone <repository-url>
   cd vocabulary-manager
   ```

2. Build and run the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3000`.

### Frontend
The frontend is built using React and TypeScript. It includes components for managing vocabulary lists and flashcards.

### Backend
The backend is developed using Flask and provides RESTful APIs for managing users, vocabulary lists, and flashcards.

### Database
MySQL is used as the database to store user data, vocabulary lists, and flashcards. The database schema is defined in the `database/migrations` directory.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.