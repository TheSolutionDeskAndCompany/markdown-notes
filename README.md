# 📝 Markdown Notes

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://thesolutiondeskandcompany.github.io/markdown-notes/)
[![CI/CD](https://github.com/thesolutiondeskandcompany/markdown-notes/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/thesolutiondeskandcompany/markdown-notes/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/thesolutiondeskandcompany/markdown-notes)](https://github.com/thesolutiondeskandcompany/markdown-notes/issues)
[![GitHub stars](https://img.shields.io/github/stars/thesolutiondeskandcompany/markdown-notes)](https://github.com/thesolutiondeskandcompany/markdown-notes/stargazers)

> A beautiful, feature-rich markdown note-taking application with live preview, built with React and Tailwind CSS.

**Perfect for developers, writers, and anyone who loves markdown!** ✨

## 🚀 Live Demo

Try it out: [https://thesolutiondeskandcompany.github.io/markdown-notes/](https://thesolutiondeskandcompany.github.io/markdown-notes/)

```text
📝 Markdown Editor (Left) | 👁️ Live Preview (Right)
----------------------------------------------
| # Welcome!           | # Welcome!           |
| Start writing...     | Start writing...     |
| - Lists              | • Lists              |
| `code`               | code (syntax)        |
| **bold**             | **bold**             |
```

## ⚡ Quick Start

### Option 1: Use Online (Recommended)
Just visit the [live demo](https://thesolutiondeskandcompany.github.io/markdown-notes/) - no installation needed!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/thesolutiondeskandcompany/markdown-notes.git
cd markdown-notes

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Option 3: Deploy Your Own

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 💡 Usage Examples

### Basic Markdown
```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet points
- [ ] Todo items
- [x] Completed tasks

[Links](https://example.com) and `inline code`
```

### Code Blocks with Syntax Highlighting
```javascript
function greetUser(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to Markdown Notes!`;
}
```

### Tables and More
```markdown
| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Dark Mode | ✅ |
| Export | ✅ |

> Blockquotes for important notes

![Images](https://via.placeholder.com/300x200)
```

## ✨ Features

- **Live Markdown Preview** - See your markdown rendered in real-time
- **Multiple Notes** - Create, edit, and organize multiple notes
- **Dark/Light Mode** - Toggle between light and dark themes
- **Keyboard Shortcuts** - Work faster with handy keyboard shortcuts
- **Export Options** - Save your notes as Markdown files
- **Responsive Design** - Works on desktop and mobile devices
- **Local Storage** - Notes are automatically saved in your browser
- **Syntax Highlighting** - Code blocks with syntax highlighting

## 🌐 Deployment

### Using GitHub Pages

The app is automatically deployed to GitHub Pages at:
[thesolutiondeskandcompany.github.io/markdown-notes](https://thesolutiondeskandcompany.github.io/markdown-notes/)

### GitHub Pages Setup

The site is automatically deployed to GitHub Pages at:
`https://thesolutiondeskandcompany.github.io/markdown-notes/`

To set up GitHub Pages:
1. Go to your repository → Settings → Pages
2. Set source to "Deploy from a branch"
3. Select branch: `gh-pages` (created automatically by the workflow)
4. Your site will be available within a few minutes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/markdown-notes.git
   cd markdown-notes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Features in Detail

### Editor
- Live preview updates as you type
- Syntax highlighting for code blocks
- Word and character count
- Keyboard shortcuts for common actions

### Notes Management
- Create new notes
- Delete existing notes
- Auto-save functionality
- Search through your notes

### Customization
- Toggle between light and dark themes
- Fullscreen mode
- Customizable note titles

## ⌨️ Keyboard Shortcuts

- `Ctrl+N` - Create a new note
- `Ctrl+S` - Save current note (auto-saves by default)
- `Ctrl+D` - Toggle dark/light mode
- `F11` - Toggle fullscreen mode

## 🚀 Deployment

### Local Development

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

```bash
# Build and deploy
npm run deploy
```

This will automatically:
1. Build the production version
2. Push to the `gh-pages` branch
3. Make it available at your GitHub Pages URL

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 **Report Bugs**: [Open an issue](https://github.com/thesolutiondeskandcompany/markdown-notes/issues/new?template=bug_report.md)
- 💡 **Request Features**: [Suggest new features](https://github.com/thesolutiondeskandcompany/markdown-notes/issues/new?template=feature_request.md)
- 🔧 **Submit PRs**: Help us improve the codebase
- 📚 **Improve Docs**: Documentation improvements are always welcome
- ⭐ **Star the Repo**: Show your support!

## 🌟 Community

- 💬 **Discussions**: [GitHub Discussions](https://github.com/thesolutiondeskandcompany/markdown-notes/discussions)
- 🐛 **Issues**: [Report bugs or request features](https://github.com/thesolutiondeskandcompany/markdown-notes/issues)
- 📧 **Contact**: [The Solution Desk & Company](https://thesolutiondesk.ca)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Markdown parsing by [react-markdown](https://github.com/remarkjs/react-markdown)
- Syntax highlighting by [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 💖 Support

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** any bugs you find
- 💡 **Suggesting** new features
- 🔗 **Sharing** with others who might find it useful

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ by <a href="https://thesolutiondesk.ca">The Solution Desk & Company</a></strong>
</div>
