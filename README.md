# Image Text GIF Creator

A modern web application that allows users to create animated GIFs with custom text overlays and background removal capabilities. Built with Next.js 14, Supabase Auth, and Framer Motion.

![Hero Image](/public/static/hero.gif)

## 🌟 Features

- **Background Removal**: Automatically remove backgrounds from uploaded images
- **Text Customization**: Add multiple text overlays with custom:
  - Font styles and sizes
  - Colors and opacity
  - Position and rotation
  - Animations
- **Image Sources**:
  - Local device upload
  - Unsplash integration
- **Authentication**: Secure Google OAuth via Supabase
- **Responsive Design**: Works seamlessly across devices
- **Dark/Light Mode**: Built-in theme support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 and React 19 (App Router)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + ShadcN UI
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Image Processing**:
  - Background Removal: @imgly/background-removal
  - GIF Generation: modern-gif
- **Deployment**: Vercel

## 🏗️ Project Structure

├── app/ # Next.js 14 app directory
│ ├── (auth)/ # Auth-related routes
│ ├── create/ # Main GIF creation page
│ └── layout.tsx # Root layout
├── components/ # React components
│ ├── create/ # GIF creation components
│ ├── nav/ # Navigation components
│ └── ui/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
├── store/ # Zustand state management
├── types/ # TypeScript definitions
└── utils/ # Helper utilities

## 🔒 Authentication Flow

The app uses Supabase Authentication with Google OAuth:

1. User clicks "Sign In with Google"
2. Redirected to Google consent screen
3. After approval, redirected back to app
4. Session managed via Supabase cookies
5. Protected routes handled via middleware

## 💰 Monetization

The app includes a built-in payment dialog for premium features:

- Free tier: Limited generations
- Premium tier: Unlimited generations
- Payment integration ready for Razorpay/Stripe

### Custom Themes

Modify the theme in `app/globals.css` using Tailwind CSS variables.

## 📈 Performance Optimizations

- Dynamic imports for heavy components
- Image optimization via Next.js Image
- Lazy loading for animations
- Efficient state management with Zustand

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the main branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for authentication
- [ShadcN UI](https://ui.shadcn.com/) for components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vercel](https://vercel.com/) for hosting

---

Built with ❤️ by [mxnan](https://mxnan.vercel.app/)
