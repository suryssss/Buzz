# 💬 Real-Time Chat Application  

A modern **real-time chat app** built with **Next.js**, **Convex**, **Clerk Authentication**, and **shadcn/ui**. Users can chat 1:1 or in groups with a clean, responsive UI.  

---

## 🚀 Features  
- 🔐 **Secure Authentication** – User signup/sign-in handled by [Clerk](https://clerk.com)  
- 💬 **Real-Time Messaging** – Powered by [Convex](https://convex.dev) for live updates  
- 👥 **Group Chats** – Create, manage, and chat in groups seamlessly  
- 🎨 **Modern UI** – Styled with [shadcn/ui](https://ui.shadcn.com) and react-bits  
- ⚡ **Next.js Optimizations** – Fast rendering, routing, and scalability  

---

## 🛠 Tech Stack  
- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/)  
- **Backend:** [Convex](https://convex.dev/)  
- **Authentication:** [Clerk](https://clerk.com)  
- **UI Components:** [shadcn/ui](https://ui.shadcn.com), react-bits  
- **Styling:** Tailwind CSS  

---

⚙️ Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/chat-app.git
cd chat-app

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Set up environment variables

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT=your_convex_url

4️⃣ Run Convex
npx convex dev

5️⃣ Start the development server
npm run dev


App will be live at 👉 http://localhost:3000
