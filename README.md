# ❤️ HeartSync: Connecting Hearts Across Generations

A modern dating app designed to foster meaningful connections between women and younger men. Discover authentic relationships based on shared interests and mutual respect. ✨

## 🚀 Installation

Get HeartSync up and running locally with these simple steps:

- ⬇️ **Clone the Repository:**

```bash
git clone https://github.com/PabloVS044/heartSync.git
```

- 🛠️ **Navigate to the Project Directory:**

```bash
cd heartSync
```

- 📦 **Install Dependencies:**

```bash
npm install
```

- ⚙️ **Configure Environment Variables:**

  Create a `.env` file in the project root and add your environment variables:

```
VITE_APP_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

- 🚀 **Start the Development Server:**

```bash
npm run dev
```

## 💻 Usage

### Landing Page

Showcasing the project's objective, main features, and general look and feel.

<details>
<summary><b>View Landing Page Code</b></summary>

```jsx
import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Users,
  Heart,
  ArrowRight,
  Star,
  Shield,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const testimonials = [
    {
      name: "María",
      age: 45,
      location: "Madrid",
      image: "/placeholder.svg?height=48&width=48",
      text: "Después de mi divorcio, pensé que no encontraría a nadie. HeartSync me conectó con David, y llevamos 2 años juntos. La diferencia de edad nunca ha sido un problema.",
    },
    {
      name: "Carlos",
      age: 32,
      location: "Barcelona",
      image: "/placeholder.svg?height=48&width=48",
      text: "Siempre me han atraído las mujeres maduras. En HeartSync encontré a Sofía, una mujer increíble que comparte mis intereses y me ha enseñado tanto.",
    },
    {
      name: "Elena",
      age: 50,
      location: "Valencia",
      image: "/placeholder.svg?height=48&width=48",
      text: "HeartSync me dio la confianza para volver a salir después de años de estar soltera. Conocí a Miguel, que es 15 años menor que yo, y tenemos una relación maravillosa basada en el respeto mutuo.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const stats = [
    { value: "10K+", label: "Usuarios activos" },
    { value: "85%", label: "Tasa de éxito" },
    { value: "4.8", label: "Calificación promedio" },
  ];

  const handleNavigation = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    window.location.href = "/registro";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (<></>)
}
```
</details>

## ✨ Features

- 💘 **Age-Gap Connections:** Connect with people outside of the current status quo.
- 💬 **Real-time Messaging:** Instant chat to spark meaningful conversations.
- 🔒 **Profile Verification:** Verified profiles for added safety and authenticity.
- 🌍 **Global Reach:** Connect with singles locally or internationally.
- 💖 **Personalized Matching:** Powerful algorithms to find your perfect match.

## 🛠️ Technologies Used

| Technology           | Description                               | Link                                       |
| :------------------- | :---------------------------------------- | :----------------------------------------- |
| React                | Frontend framework                        | [https://react.dev/](https://react.dev/)   |
| Tailwind CSS         | CSS framework                             | [https://tailwindcss.com/](https://tailwindcss.com/) |
| Radix UI             | UI component library                      | [https://www.radix-ui.com/](https://www.radix-ui.com/) |
| Axios                | HTTP client for making API requests     | [https://axios-http.com/](https://axios-http.com/) |
| Socket.IO            | Realtime, bidirectional event-based communication | [https://socket.io/](https://socket.io/)         |
| Dokugen            | README generation                        | [https://www.npmjs.com/package/dokugen](https://www.npmjs.com/package/dokugen)         |

## 🤝 Contributing

We welcome contributions to enhance HeartSync! Please follow these guidelines:

- 🐞 **Report Bugs:** Help us squash those pesky bugs!
- 💡 **Suggest Features:** Share your ideas to make HeartSync even better.
- 🛠️ **Submit Pull Requests:** Contribute code improvements and new features.

## 📜 License

This project is under the [MIT License](https://opensource.org/license/mit/).

## 🧑‍💻 Author Info

- Pablo:  [Github](https://github.com/PabloVS044)

## 🏅 Badges

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://shields.io/)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/Naereen/ama)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
