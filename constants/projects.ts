// app/constants/projects.ts

export type MaterialItem = {
  name: string;
  code: string;
  qty?: string;
  note?: string;
};

export type Project = {
  code: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  images: string[]; // remote URLs
  idea?: string;
  materials?: MaterialItem[];
};

export const PROJECTS: Record<string, Project> = {
  bathroom_001: {
    code: "bathroom_001",
    title: "Баня • Проект 001",
    subtitle: "Гранитогрес + мебели от Темакс",
    tags: ["60×120", "черни акценти", "LED ниша", "LED огледало"],
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    ],
    idea:
      "Съвременна баня в светли тонове с голямоформатни плочки 60×120, черни смесители и LED акценти.",
    materials: [
      { name: "Гранитогрес 60×120", code: "GR-60120", qty: "18 м²" },
      { name: "Черни смесители", code: "MX-BLACK", qty: "1 комплект" },
      { name: "LED лента ниша", code: "LED-12V-IP65", qty: "3 м" },
      { name: "Огледало с подсветка", code: "MR-LED-80", qty: "1 бр." },
    ],
  },
};
