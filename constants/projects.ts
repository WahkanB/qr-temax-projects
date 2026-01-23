// constants/projects.ts
export type Project = {
  code: string;
  title: string;
  subtitle?: string;
  idea: string;
  tags?: string[];
  images: string[]; // URLs
  products?: { label: string; value: string }[];
};

export const PROJECTS: Record<string, Project> = {
  bathroom_001: {
    code: "bathroom_001",
    title: "Баня • Проект 001",
    subtitle: "Гранитогрес + мебели от нашия магазин",
    idea:
      "Съвременна баня в светли тонове: голямоформатни плочки 60×120, черни акценти, ниша в душа с LED лента и огледало с подсветка.",
    tags: ["60×120", "черни акценти", "LED ниша", "огледало LED"],
    images: [
      // сложи реални URL-и (от твой хостинг / Google Drive direct / CDN)
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80",
    ],
    products: [
      { label: "Плочки", value: "60×120 • светъл бетон" },
      { label: "Акценти", value: "черни профили/смесители" },
      { label: "Осветление", value: "LED ниша + LED огледало" },
    ],
  },
};
