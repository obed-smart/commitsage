# Commitsaga

## Overview

Ever find yourself staring at your changes, struggling to craft that perfect, conventional commit message? This tool helps you out by automatically generating clear, concise, and structured commit messages based on your staged changes, saving you time and ensuring consistency across your project's commit history. It's like having a helpful assistant for your Git commits.

## Features

- Analyzes your Git changes to understand what you've modified.
- Automatically prompts you to stage untracked files if no changes are staged, keeping your workflow smooth.
- Generates Conventional Commits-style messages from your diff using AI.
- Offers an option for more detailed, multi-line commit messages when your changes require more explanation.
- Provides a simple command-line interface for easy use in any Git repository.

## Getting Started

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/commitsaga.git # Replace with your actual repository URL
    cd commitsaga
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
4.  **Link the CLI tool (optional, for global access):**

    ```bash
    npm link
    ```

    After linking, you can use `commitsaga` directly from any terminal. Otherwise, you can run it using `npx commitsaga`.

5.  **To link the commitsage to the git you can create a git alias**

```bash
git config --global alias.<name> 'commitsage "$@"'
```

Replace <name> with your preferred alias.

After this, you run:

```bash
git sage
```

### Environment Variables

Before running Commitsaga, you'll need to set up your API key for the commit message generation service.

- `GEMINI_COMMIT_MESSAGE_API_KEY`: Your API key for the Google Gemini API.

  Example (replace `your_api_key_here` with your actual key):

  **macOS / Linux:**

  ```bash
  export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here
  ```

  **Windows (PowerShell):**

  ```powershell
  $env:GEMINI_COMMIT_MESSAGE_API_KEY="your_api_key_here"
  ```

  After setting the variable, remember to restart your terminal or command prompt for the changes to take effect.

## Usage

Once Commitsaga is installed and your environment variable is configured, you can use it in any Git repository.

1.  **Navigate to your Git repository:**
    ```bash
    cd /path/to/your/project
    ```
2.  **Run `commitsaga`:**

    ```bash
    commitsaga
    ```

    The tool will automatically detect your staged changes. If there are no staged changes, it'll ask if you want to stage all modified files. It will then generate a commit message based on the diff and prompt you to confirm before making the commit.

3.  **Generate a detailed commit message:**
    If your changes are complex and you want a more descriptive commit message, including a body with bullet points (following Conventional Commits standards), use the `--detailed` flag:
    ```bash
    commitsaga --detailed
    ```

## Technologies Used

| Technology                                             | Description                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| [TypeScript](https://www.typescriptlang.org/)          | A strongly typed programming language that builds on JavaScript, giving you better tooling and fewer bugs.                     |
| [Node.js](https://nodejs.org/)                         | A JavaScript runtime built on Chrome's V8 JavaScript engine, perfect for building fast and scalable network applications.      |
| [Google Gemini](https://gemini.google.com/)            | An advanced AI model used for natural language understanding and generation, powering the intelligent commit message creation. |
| [axios](https://axios-http.com/)                       | A popular promise-based HTTP client for making requests to external APIs.                                                      |
| [chalk](https://www.npmjs.com/package/chalk)           | A library for terminal string styling, making console output more readable and engaging.                                       |
| [commander](https://www.npmjs.com/package/commander)   | A Node.js library that makes building robust command-line interfaces easy.                                                     |
| [dotenv](https://www.npmjs.com/package/dotenv)         | A module that loads environment variables from a `.env` file into `process.env`.                                               |
| [simple-git](https://www.npmjs.com/package/simple-git) | A light-weight interface for running Git commands in Node.js, abstracting away the complexities of Git CLI.                    |
| [tsx](https://github.com/esbuild-kit/tsx)              | A tool that seamlessly runs TypeScript and ESM in Node.js without pre-compilation.                                             |

## Contributing

I'd love for you to contribute to Commitsaga! If you have suggestions for improvements, new features, or find any bugs, please feel free to open an issue or submit a pull request.

Here’s how you can help:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
3.  **Make your changes** and commit them with a clear, descriptive commit message (you can even use `commitsaga` itself to help!).
4.  **Push your branch** to your fork.
5.  **Open a pull request** describing your changes.

Please ensure your code adheres to the project's coding standards and includes relevant tests if applicable.

## License

This project is licensed under the ISC License. See the `package.json` file for more details.

## Badges

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
