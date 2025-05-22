# Groovestack Core Sandbox Application

This is a sandbox application built using the Groovestack Core ecosystem, an opinionated fullstack application framework that combines PostgreSQL, Ruby on Rails, GraphQL, and React-Admin to create powerful web applications.

## About Groovestack

Groovestack is a comprehensive fullstack framework that leverages:
- PostgreSQL for the database layer
- Ruby on Rails for the backend
- GraphQL for the API layer
- React-Admin for the frontend
- TypeScript, Vite, and Rollup for frontend tooling

For more information about Groovestack, visit the [official documentation](https://talysto.com/tech/groovestack/). You can also explore the [Groovestack Core repository](https://github.com/talysto/groovestack-core/tree/next) to see the source code and available modules.

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker and Docker Compose
- [Taskfile](https://taskfile.dev/) (optional - you can run Docker Compose commands directly)

## Environment Setup

This application uses Rails credentials for secure configuration. You'll need to set up your environment:

1. Copy the sample environment file:
   ```bash
   cp .env.sample .env
   ```

2. For this sandbox application, use the following test master key:
   ```bash
   # In config/master.key
   58d3b4a1cee561b9e0a41ae94d68b557
   ```

   ⚠️ **Important**: This is a sandbox master key and should never be used in production environments.

3. You can view or edit the credentials using Cursor as your editor:
   ```bash
   EDITOR='cursor --wait' bundle exec rails credentials:edit
   ```

## Getting Started

### Using Taskfile (Recommended)

1. Install Taskfile if you haven't already:
   ```bash
   # On macOS using Homebrew
   brew install go-task
   ```

2. Start the application:
   ```bash
   task docker-compose-watch
   ```

### Without Taskfile

If you prefer not to use Taskfile, you can run the Docker Compose commands directly:

```bash
docker compose watch
```

Inspect Taskfile.yml for supported commands.

## Development

The application will be available at `http://localhost:3000`

## Contributing

This is a sandbox application intended for learning and experimenting with the Groovestack Core ecosystem. Feel free to modify and extend it according to your needs.

## License

This sandbox application is available as open source under the terms of the MIT License.
