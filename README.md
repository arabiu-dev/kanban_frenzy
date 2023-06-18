# Frenzy Kanban Board

Frenzy Kanban Board is a modern task management and collaboration tool inspired by Trello. It provides a visual interface for organizing tasks into boards, lists, and cards, making it easy to track and prioritize work.

## Features

- Create and manage multiple boards
- Add lists and cards to boards
- Drag and drop cards to rearrange and prioritize tasks
- Assign due dates and labels to cards
- Collaborate with team members by sharing boards
- Real-time updates for seamless teamwork

## Technologies Used

- Frontend: React, Redux, HTML, CSS
- Backend: Go, Gin framework
- Database: PostgreSQL
- Authentication: None
- Deployment: RailWay (BE) & Netlify (FE)

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/arabiu-dev/kanban_frenzy
   ```

2. Navigate to the project directory

   ```bash
   cd kanban_frenzy/frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your web browser and visit http://localhost:3000 to access the Frenzy Kanban Board application.

## Backend Setup

To set up the backend server, follow these additional steps:

1. Install Go on your machine if you haven't already. You can download it from the official website: https://golang.org/

2. Navigate to the backend directory:

   ```bash
   cd frenzy_knaban/backend
   ```

3. Create an .env file in the backend directory.

4. Open the .env file and configure the following environment variables:

   ```bash
   # Port the server should run on
   PORT="port"

   # Database URL the server will communicate with
   # Url Format postgres://<user>:<password>@localhost:5432/<database_name>
   DB_URL="your db url"

   # Secret Key for JWT encryption - Feel free to test with this one
   SECRET_KEY=8E274C6912828F30F539FF0DE5836F101ED79410368F7379E361D5C68DE6F715
   ```

5. Install the Go dependencies:

   ```bash
   go mod download
   ```

6. Start the backend server:
   ```bash
   go run main.go
   ```

## Contributing

Contributions are welcome! If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes.
4. Commit and push your changes to your forked repository.
5. Create a pull request to the original repository.

# License

The Frenzy Kanban Board project is licensed under the MIT License. See the LICENSE file for more details.
