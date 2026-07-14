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

---

## 6. Roadmap & Assessment System

### 6.1. Get Roadmap Modules & Progress
*   **Method**: `GET`
*   **URL**: `/api/roadmaps/:id`
*   **Authentication**: Bearer Token
*   **Response (200 OK)**: Returns the roadmap track details, modules grouped into beginner, intermediate, and expert levels, and user level completion progress percentages.

### 6.2. Get Lesson Topic Quiz
*   **Method**: `GET`
*   **URL**: `/api/lessons/:id/quiz`
*   **Authentication**: Bearer Token
*   **Response (200 OK)**: Returns 10-15 randomized multiple choice questions mapped to the lesson.

### 6.3. Submit Lesson Topic Quiz
*   **Method**: `POST`
*   **URL**: `/api/lessons/:id/quiz/submit`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "answers": {
        "quiz_question_id_1": "A",
        "quiz_question_id_2": "C"
      }
    }
    ```
*   **Response (200 OK)**: Returns the score, pass/fail status (70% passing threshold), and explanations for each question. Award 50 XP upon passing.

### 6.4. Get Level Assessment
*   **Method**: `GET`
*   **URL**: `/api/roadmaps/:id/level/:level/exam`
*   **Authentication**: Bearer Token
*   **Response (200 OK)**: Returns 50 randomized questions covering all modules in the level.

### 6.5. Submit Level Assessment
*   **Method**: `POST`
*   **URL**: `/api/roadmaps/:id/level/:level/exam/submit`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "answers": { "q_id": "A" },
      "time_taken": 1200
    }
    ```
*   **Response (200 OK)**: Returns graded report, pass/fail status, and unlocks the next level. Awards 300/500/700 XP based on level.

### 6.6. Get Roadmap Certification Exam
*   **Method**: `GET`
*   **URL**: `/api/roadmaps/:id/exam`
*   **Authentication**: Bearer Token
*   **Response (200 OK)**: Returns 100 randomized questions covering the entire roadmap curriculum.

### 6.7. Submit Roadmap Certification Exam
*   **Method**: `POST`
*   **URL**: `/api/roadmaps/:id/exam/submit`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "answers": { "q_id": "B" },
      "time_taken": 3500
    }
    ```
*   **Response (200 OK)**: Returns final score, pass status, and verified completion certificate hash. Awards 1000 XP.

### 6.8. Save Quiz Session State
*   **Method**: `POST`
*   **URL**: `/api/roadmaps/quiz-session/save`
*   **Authentication**: Bearer Token
*   **Request Body**:
    ```json
    {
      "type": "level",
      "target_id": "python_beginner",
      "questions": [1, 2, 3],
      "answers": { "1": "A" },
      "time_left": 3000,
      "bookmarks": [2]
    }
    ```
*   **Response (200 OK)**: Returns `{ "success": true }`. Allows resuming the assessment state.

