<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Task Flow API

This project is a REST API built with NestJS, a progressive Node.js framework. It provides a robust and scalable architecture for building server-side applications. This API serves as a backbone for managing task flows efficiently.

## Database Design

Here is the database design used in this project:

![Database Design](https://res.cloudinary.com/dbbixakcl/image/upload/f_auto,q_auto/v1/task-flow-api/uma5mf8d7hl0aduji0uy)

## Installation

Before running the application, make sure you have Node.js and pnpm installed on your machine.

```bash
  git clone https://github.com/BranLeeDev/task-flow-api.git
  cd task-flow-api
  pnpm i
```

## Environment Variables

After installing the application, configure the following environment variables:

- **NODE_ENV**: Set to `'development'` or `'production'`.
- **PORT**: Port number for the server.
- **POSTGRES_DB**: PostgreSQL database name.
- **POSTGRES_USER**: PostgreSQL username.
- **POSTGRES_PASSWORD**: PostgreSQL password.
- **POSTGRES_HOST**: PostgreSQL server hostname.
- **POSTGRES_PORT**: PostgreSQL server port number.
- **PGADMIN_EMAIL**: Email for accessing PgAdmin.
- **PGADMIN_PASSWORD**: Password for accessing PgAdmin.
- **PGADMIN_HOST_PORT**: Port number for accessing PgAdmin host.
- **PGADMIN_PORT**: Port number for PgAdmin.

Ensure these variables are appropriately configured for the application's smooth operation in the development environment. Remember to manage sensitive data securely.

## Contribution

Contributions are welcome! Here's how you can contribute to the Task Flow API project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure they adhere to the project's coding standards.
4. Write tests for your changes if applicable.
5. Run the existing tests and ensure they pass.
6. Commit your changes with descriptive commit messages.
7. Push your changes to your forked repository.
8. Submit a pull request to the main repository's `main` branch.

Thank you for considering contributing to the project! Your help is greatly appreciated.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
