# Blogzy API Reference

This document provides a reference for the Blogzy API endpoints.

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

You can obtain a token by using the login endpoint.

## Error Handling

The API returns appropriate HTTP status codes for different types of errors:

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses have the following format:

```json
{
  "error": "Error message",
  "status_code": 400
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per IP address.

## Endpoints

### Authentication

#### Register a new user

```
POST /api/v1/auth/register
```

Request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST /api/v1/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Refresh token

```
POST /api/v1/auth/refresh
```

Request body:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```
POST /api/v1/auth/logout
```

Response:

```json
{
  "message": "Successfully logged out"
}
```

### Users

#### Get current user

```
GET /api/v1/users/me
```

Response:

```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software developer",
    "website": "https://johndoe.com",
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

#### Update current user

```
PUT /api/v1/users/me
```

Request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "bio": "Full-stack developer",
  "website": "https://johndoe.dev"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Full-stack developer",
    "website": "https://johndoe.dev",
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

#### Change password

```
PUT /api/v1/users/password
```

Request body:

```json
{
  "current_password": "securepassword",
  "new_password": "evenmoresecurepassword"
}
```

Response:

```json
{
  "message": "Password updated successfully"
}
```

#### Get user's posts

```
GET /api/v1/users/posts
```

Response:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is my first post content...",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "author": {
        "id": 1,
        "username": "johndoe"
      },
      "tags": [
        {
          "id": 1,
          "name": "technology"
        }
      ]
    }
  ],
  "total": 1
}
```

### Posts

#### Get all posts

```
GET /api/v1/posts
```

Query parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `tag`: Filter by tag name
- `search`: Search term for title or content

Response:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is my first post content...",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "author": {
        "id": 1,
        "username": "johndoe"
      },
      "tags": [
        {
          "id": 1,
          "name": "technology"
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}
```

#### Get a post by slug

```
GET /api/v1/posts/{slug}
```

Response:

```json
{
  "post": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is my first post content...",
    "created_at": "2023-01-02T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z",
    "author": {
      "id": 1,
      "username": "johndoe"
    },
    "tags": [
      {
        "id": 1,
        "name": "technology"
      }
    ],
    "comments": [
      {
        "id": 1,
        "content": "Great post!",
        "created_at": "2023-01-03T00:00:00Z",
        "author": {
          "id": 2,
          "username": "janedoe"
        }
      }
    ]
  }
}
```

#### Create a post

```
POST /api/v1/posts
```

Request body:

```json
{
  "title": "My New Post",
  "content": "This is the content of my new post...",
  "tags": [1, 2],
  "image_url": "https://example.com/image.jpg"
}
```

Response:

```json
{
  "post": {
    "id": 2,
    "title": "My New Post",
    "slug": "my-new-post",
    "content": "This is the content of my new post...",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2023-01-04T00:00:00Z",
    "updated_at": "2023-01-04T00:00:00Z",
    "author": {
      "id": 1,
      "username": "johndoe"
    },
    "tags": [
      {
        "id": 1,
        "name": "technology"
      },
      {
        "id": 2,
        "name": "programming"
      }
    ]
  }
}
```

#### Update a post

```
PUT /api/v1/posts/{id}
```

Request body:

```json
{
  "title": "Updated Post Title",
  "content": "Updated content...",
  "tags": [1, 3],
  "image_url": "https://example.com/new-image.jpg"
}
```

Response:

```json
{
  "post": {
    "id": 2,
    "title": "Updated Post Title",
    "slug": "updated-post-title",
    "content": "Updated content...",
    "image_url": "https://example.com/new-image.jpg",
    "created_at": "2023-01-04T00:00:00Z",
    "updated_at": "2023-01-05T00:00:00Z",
    "author": {
      "id": 1,
      "username": "johndoe"
    },
    "tags": [
      {
        "id": 1,
        "name": "technology"
      },
      {
        "id": 3,
        "name": "webdev"
      }
    ]
  }
}
```

#### Delete a post

```
DELETE /api/v1/posts/{id}
```

Response:

```json
{
  "message": "Post deleted successfully"
}
```

### Comments

#### Add a comment to a post

```
POST /api/v1/posts/{post_id}/comments
```

Request body:

```json
{
  "content": "This is a great post!"
}
```

Response:

```json
{
  "comment": {
    "id": 2,
    "content": "This is a great post!",
    "created_at": "2023-01-05T00:00:00Z",
    "author": {
      "id": 1,
      "username": "johndoe"
    }
  }
}
```

#### Update a comment

```
PUT /api/v1/comments/{id}
```

Request body:

```json
{
  "content": "Updated comment content"
}
```

Response:

```json
{
  "comment": {
    "id": 2,
    "content": "Updated comment content",
    "created_at": "2023-01-05T00:00:00Z",
    "updated_at": "2023-01-06T00:00:00Z",
    "author": {
      "id": 1,
      "username": "johndoe"
    }
  }
}
```

#### Delete a comment

```
DELETE /api/v1/comments/{id}
```

Response:

```json
{
  "message": "Comment deleted successfully"
}
```

### Tags

#### Get all tags

```
GET /api/v1/tags
```

Response:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "technology"
    },
    {
      "id": 2,
      "name": "programming"
    },
    {
      "id": 3,
      "name": "webdev"
    }
  ]
}
```

#### Create a tag

```
POST /api/v1/tags
```

Request body:

```json
{
  "name": "javascript"
}
```

Response:

```json
{
  "tag": {
    "id": 4,
    "name": "javascript"
  }
}
```

#### Get posts by tag

```
GET /api/v1/tags/{name}/posts
```

Response:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is my first post content...",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "author": {
        "id": 1,
        "username": "johndoe"
      },
      "tags": [
        {
          "id": 1,
          "name": "technology"
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}
```

## Pagination

Endpoints that return lists of resources support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `per_page`: Number of items per page (default: 10, max: 100)

Paginated responses include the following metadata:

```json
{
  "total": 42,       // Total number of items
  "page": 2,         // Current page
  "per_page": 10,    // Items per page
  "total_pages": 5   // Total number of pages
}
```

## Filtering and Sorting

Some endpoints support filtering and sorting:

- `sort`: Field to sort by (e.g., `created_at`)
- `order`: Sort order (`asc` or `desc`, default: `desc`)
- `search`: Search term for text fields
- `tag`: Filter by tag name

Example:

```
GET /api/v1/posts?sort=created_at&order=desc&tag=technology
```

## Versioning

The API is versioned using URL path versioning. The current version is `v1`.

Future versions will be available at `/api/v2`, `/api/v3`, etc.