# SQL Hero

An interactive web application for learning SQL through practical exercises. SQL Hero guides users through fundamental SQL concepts including SELECT statements, WHERE clauses, and GROUP BY operations.

## Features

- Step-by-step SQL tutorials
- Interactive exercises with varying difficulty levels
- Immediate feedback on solutions
- Comprehensive coverage of SQL concepts:
  - Data Definition Language (DDL)
  - Data Manipulation Language (DML) 
  - Data Control Language (DCL)
  - Transaction Control Language (TCL)

## Exercise Structure

Each exercise is self-contained and provides:
- Clear task description
- Solution validation
- Detailed error messages for debugging
- Comparison against sample solutions

## Error Handling

The application provides two types of error feedback:
1. Logical errors: When results don't match expected output
2. Technical errors: When SQL execution fails (e.g., syntax errors, missing tables)

All error messages are displayed in English, directly from the SQL executor.

## Getting Started

To get started with SQLHero, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://gitea.it.bbwi/michaelis.m/SQLHero.git
    ```
2. Navigate to the project directory:
    ```sh
    cd SQLHero
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Build SQL Hero

_Just run:_

```sh
npm run build
```