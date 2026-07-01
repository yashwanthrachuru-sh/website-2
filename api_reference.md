# EduNet API Reference Manual

This document details the complete REST API endpoints, request/response formats, security parameters, and error codes for the EduNet backend services.

---

## 1. Authentication Endpoints

### 1.1. User Registration
*   **Method**: `POST`
*   **URL**: `/api/auth/register`
*   **Authentication**: None
*   **Request Body**:
    ```json
    {
      "username": "john_doe",
      "email": "john@edunet.com",
      "password": "MySecretPassword123",
      "branch": "SDE"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Registration successful. Your account is pending administrator approval before you can log in.",
      "user": {
        "id": 14,
        "username": "john_doe",
        "email": "john@edunet.com",
        "branch": "SDE",
        "role": "user",
        "status": "pending"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If username or email is already registered, or password is too short.

### 1.2. User Login
*   **Method**: `POST`
*   **URL**: `/api/auth/login`
*   **Authentication**: None
*   **Request Body**:
    ```json
    {
      "username": "john_doe",
      "password": "MySecretPassword123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 14,
        "username": "john_doe",
        "email": "john@edunet.com",
        "branch": "SDE",
        "role": "user",
        "status": "approved"
      }
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: If user is not yet approved, or password/username is incorrect.

---

## 2. Student Dashboard & Progress

### 2.1. Get User Profile
*   **Method**: `GET`
*   **URL**: `/api/user/profile` (also mapped to `/api/profile`)
*   **Authentication**: Bearer Token
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "user": {
        "id": 14,
        "username": "john_doe",
        "email": "john@edunet.com",
        "branch": "SDE",
        "xp": 500,
        "level": 2,
        "streak": 3,
        "bio": "B.Tech SDE student"
      }
    }
    ```

### 2.2. Sync XP
*   **Method**: `POST`
*   **URL**: `/api/user/xp`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "amount": 100,
      "source": "lesson_1"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "xp": 600,
      "level": 2,
      "added": 100,
      "already_claimed": false
    }
    ```

---

## 3. Developer Portfolio Endpoints

### 3.1. Fetch Authenticated Portfolio
*   **Method**: `GET`
*   **URL**: `/api/portfolio`
*   **Authentication**: Bearer Token
*   **Response (200 OK)**: Returns the user settings, projects list, certificates, achievements, and completion strength.

### 3.2. Add Custom Project
*   **Method**: `POST`
*   **URL**: `/api/portfolio/project`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "title": "My Compiler",
      "description": "Custom parser in C++",
      "tech_stack": "C++, ANTLR",
      "github_link": "https://github.com/john/compiler"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Project added successfully.",
      "projectId": 34
    }
    ```

### 3.3. Get Public Profile (Recruiter Link)
*   **Method**: `GET`
*   **URL**: `/api/portfolio/public/:username` (also `/api/portfolio/:username`)
*   **Authentication**: None
*   **Response (200 OK)**: Returns the public developer view (if `is_public` is enabled).

---

## 4. Coding Lab & Sandbox

### 4.1. Run Code
*   **Method**: `POST`
*   **URL**: `/api/code/run`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "code": "print('Hello world')",
      "language": "python"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "output": "Python Output:\n  Hello world"
    }
    ```

---

## 5. AI Resume Builder

### 5.1. Save Resume Configuration
*   **Method**: `POST`
*   **URL**: `/api/resume/save`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "title": "My Software Resume",
      "template": "modern",
      "personal_info": { "name": "John Doe", "email": "john@edunet.com" },
      "education": [],
      "experience": []
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Resume saved successfully.",
      "id": 12
    }
    ```
