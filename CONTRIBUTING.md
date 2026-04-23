# Contributing to EcoMine MERN

Thank you for your interest in contributing to EcoMine MERN! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/ecomine-mern.git
cd ecomine-mern
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Write clean, readable code
- Add comments for complex logic
- Follow the project's coding style
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git add .
git commit -m "Brief description of changes"
```

Use clear and descriptive commit messages.

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Select your feature branch
- Provide a detailed description of your changes
- Reference any related issues

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use consistent indentation (2 spaces)

### Commit Messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Be descriptive but concise
- Use lowercase
- Example: `Add LCA calculation validation`

### Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/ecomine-mern.git
   cd ecomine-mern
   ```

2. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Setup environment**
   - Copy `.env.example` to `.env`
   - Configure your MongoDB connection
   - Set JWT secret

4. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

## Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, etc.)

## Suggesting Features

We love new ideas! Please open an issue with:
- Feature description
- Use case and benefits
- Possible implementation approach
- Examples or mockups

## Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed your code
- [ ] Commented complex logic
- [ ] Updated relevant documentation
- [ ] Added tests for new features
- [ ] All tests pass locally
- [ ] No new warnings generated
- [ ] Changes are backwards compatible

## Questions?

Feel free to:
- Open an issue for questions
- Check existing documentation
- Reach out to maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under its MIT License.

---

Thank you for making EcoMine MERN better! 🌱
