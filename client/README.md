# Kifaru Crafts - Kenyan Artisan Marketplace

A full-stack e-commerce platform connecting authentic Kenyan artisans with global customers. Built with the MERN stack (MongoDB, Express, React, Node.js) and modern web technologies.

## ✨ Features

- **Artisan Marketplace**: Connect Kenyan artisans with global customers
- **Multi-currency Support**: KES, USD, EUR, GBP with real-time conversion
- **Role-based Access**: Customer and vendor dashboards
- **Product Management**: Complete CRUD operations for vendors
- **Shopping Cart**: Persistent cart with session management
- **Authentication**: Secure session-based authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Cultural Theming**: Kenyan-inspired design elements

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Wouter** for routing
- **React Query** for state management
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Express Sessions** for authentication
- **bcrypt** for password hashing
- **TypeScript** throughout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd kifaru-crafts
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local .env
```

Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/kifaru-crafts
SESSION_SECRET=your_secure_random_string_32_chars_minimum
NODE_ENV=development
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5000
```

## 📁 Project Structure

```
kifaru-crafts/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
│   └── index.html
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── data/               # Sample data
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts
├── .vscode/                # VS Code configuration
├── package.json
└── README.md
```

## 🔐 Test Credentials

### Customer Account
- Email: `nyawiraalvin@gmail.com`
- Password: `password123`

### Vendor Account
- Email: `mary.wanjiku@kifaru.com`
- Password: `vendor123`

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

## 🌍 Database

The application uses MongoDB with Mongoose ODM. It includes:
- **Fallback Storage**: In-memory storage for development without MongoDB
- **Sample Data**: Automatically populated with demo products and users
- **Session Management**: MongoDB sessions with memory store fallback

## 🎨 Design Features

- **Kenyan Cultural Elements**: Inspired by Kenyan art and culture
- **Multi-currency Display**: Automatic currency conversion
- **Mobile-first Design**: Responsive across all devices
- **Accessibility**: Built with accessible components
- **Dark Mode**: System preference detection

## 📦 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Kenyan artisans and their beautiful crafts
- Built with modern web technologies
- Designed for cultural authenticity and fair trade

---

**Made with ❤️ for Kenyan artisans and global customers**