export type Project = {
  code: string;
  title: string;
  subtitle: string;
  idea: string;
  images: string[]; // URL-и (най-лесно за Vercel)
};

export const PROJECTS: Record<string, Project> = {
  bathroom_001: {
    code: "bathroom_001",
    title: "Баня • Проект 001",
    subtitle: "Гранитогрес + мебели от нашия магазин",
    idea:
      "Съвременна баня в светли тонове: голямоформатни плочки 60×120, черни акценти, ниша в душа с LED лента и огледало с подсветка.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};
