# Vi Ngo Quoc - Static Portfolio

A fully static portfolio website that can be deployed to GitHub Pages or any static hosting service.

## 🚀 Quick Deploy to GitHub Pages

1. **Fork or clone this repository**
2. **Enable GitHub Pages** in repository settings
3. **Set source to GitHub Actions**
4. **Push to main branch** - Auto deploy!

## 🌐 Live Demo

Visit: `https://your-username.github.io/your-repo-name`

## ✨ Features

- **100% Static**: No server required, pure client-side
- **GitHub Pages Ready**: Deploy with one push
- **Modern UI**: React + Tailwind CSS with animations
- **Responsive**: Mobile-first design
- **Fast Loading**: Optimized static assets
- **JSON Data**: Easy to customize content
- **Icons8 Integration**: Professional icons
- **Contact Form**: Ready for integration

## 📁 Structure

```
nqvi-pro5/
├── public/
│   ├── data/          # JSON data files
│   ├── icons/         # Icons8 PNG assets
│   └── images/        # Profile images
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   └── services/      # API services
└── dist/             # Build output (auto-generated)
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 🚀 Deployment Options

### GitHub Pages (Recommended)
1. Push to GitHub repository
2. Enable Pages in Settings → Pages
3. Select "GitHub Actions" as source
4. Done! Auto-deploy on push

### Other Static Hosts
- **Netlify**: Drag & drop `dist` folder
- **Vercel**: Connect GitHub repo
- **Surge.sh**: `surge dist/`

## 🎨 Customization

### Update Profile Data
Edit files in `public/data/`:
- `profile.json` - Personal info
- `skills.json` - Technical skills  
- `projects.json` - Portfolio projects
- `experience.json` - Work history
- `education.json` - Education background

### Change Styling
- Colors: `tailwind.config.js`
- Components: `src/components/`
- Global styles: `src/index.css`

## 📱 Contact Integration

The portfolio includes contact form ready for:
- **Formspree**: Add your form endpoint
- **EmailJS**: Client-side email service
- **Netlify Forms**: If deployed on Netlify

## 🔧 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Icons8** - Professional Icons
- **JSON** - Static Data

## 📄 License

MIT License - Feel free to use for your own portfolio!

---

⭐ **Star this repo if it helped you build your portfolio!**
