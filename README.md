# Markdown Notes

A beautiful, feature-rich markdown note-taking application with live preview, built with React and Tailwind CSS.

![Markdown Notes Screenshot](https://via.placeholder.com/1200x800/1e293b/ffffff?text=Markdown+Notes+Screenshot)

## ✨ Features

- **Live Markdown Preview** - See your markdown rendered in real-time
- **Multiple Notes** - Create, edit, and organize multiple notes
- **Dark/Light Mode** - Toggle between light and dark themes
- **Keyboard Shortcuts** - Work faster with handy keyboard shortcuts
- **Export Options** - Save your notes as Markdown files
- **Responsive Design** - Works on desktop and mobile devices
- **Local Storage** - Notes are automatically saved in your browser
- **Syntax Highlighting** - Code blocks with syntax highlighting

## 🌐 Custom Domain Setup

To use your custom domain `thesolutiondesk.ca/tools/free/markdown`:

### 1. DNS Configuration

Add these records in your domain's DNS settings:

```dns
# CNAME Record
Name: tools.thesolutiondesk.ca
Type: CNAME
Value: thesolutiondeskandcompany.github.io
TTL: Auto

# TXT Record (for GitHub verification)
Name: _github-pages-challenge-thesolutiondesk
Type: TXT
Value: "<GitHub will provide this>"
TTL: Auto
```

### 2. GitHub Pages Settings

1. Go to your repository → Settings → Pages
2. Under "Custom domain", enter: `thesolutiondesk.ca/tools/free/markdown`
3. Check "Enforce HTTPS" when available

### 3. Verification

After DNS propagation (up to 48 hours), your app will be available at:

```
https://thesolutiondesk.ca/tools/free/markdown
```

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

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Markdown rendering with [React Markdown](https://github.com/remarkjs/react-markdown)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
