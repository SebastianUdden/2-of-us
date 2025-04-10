import { List } from "../types/List";
import { Task } from "../types/Task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "1. Utan inloggning visas bara mock-data",
    description: "Gå igenom kylen och skapa en inköpslista för veckan",
    priority: 1,
    completed: false,
    createdAt: new Date("2025-03-25"),
    updatedAt: new Date("2025-03-25"),
    dueDate: new Date(),
    labels: ["inköp", "mat"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "S",
  },
  {
    id: "2",
    title:
      "2. Logga in med Google för att se dina uppgifter och börja samarbeta",
    description: "Göra en grundlig städning av hela lägenheten",
    priority: 2,
    completed: false,
    createdAt: new Date("2025-03-24"),
    updatedAt: new Date("2025-03-24"),
    dueDate: new Date("2025-03-27"),
    labels: ["städning", "rutin"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "M",
  },
  {
    id: "3",
    title: "Packa inför resa",
    description: "Förbereda för weekenden i sommarstugan",
    priority: 3,
    completed: false,
    createdAt: new Date("2025-03-23"),
    updatedAt: new Date("2025-03-23"),
    dueDate: new Date("2025-03-26"),
    labels: ["resa", "planering"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "L",
  },
  {
    id: "4",
    title: "Planera middag med vänner",
    description: "Bjuda över grannarna på en gemensam middag",
    priority: 4,
    completed: false,
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2025-03-22"),
    dueDate: new Date("2025-04-10"),
    labels: ["socialt", "mat"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "S",
  },
  {
    id: "5",
    title: "Vattna växter",
    description: "Kolla alla växter i lägenheten och vattna om nödvändigt",
    priority: 5,
    completed: false,
    createdAt: new Date("2025-03-21"),
    updatedAt: new Date("2025-03-21"),
    dueDate: new Date("2025-04-03"),
    labels: ["hem", "rutin"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "S",
  },
  {
    id: "6",
    title: "Boka tandläkare",
    description: "Ringa och boka tid för årlig kontroll för oss båda",
    priority: 6,
    completed: false,
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-20"),
    dueDate: new Date("2025-04-15"),
    labels: ["hälsa", "planering"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "M",
  },
  {
    id: "7",
    title: "Uppdatera budget",
    description: "Gå igenom gemensamma utgifter och uppdatera budgeten",
    priority: 7,
    completed: false,
    createdAt: new Date("2025-03-19"),
    updatedAt: new Date("2025-03-19"),
    dueDate: new Date("2025-04-20"),
    labels: ["ekonomi", "planering"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "S",
  },
  {
    id: "8",
    title: "Fixa balkongen",
    description: "Plantera nya blommor och städa balkongen",
    priority: 8,
    completed: false,
    createdAt: new Date("2025-03-18"),
    updatedAt: new Date("2025-03-18"),
    dueDate: new Date("2025-04-25"),
    labels: ["hem", "utomhus"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "M",
  },
  {
    id: "9",
    title: "Planera sommar",
    description: "Diskutera och planera sommarsemester",
    priority: 9,
    completed: false,
    createdAt: new Date("2025-03-17"),
    updatedAt: new Date("2025-03-17"),
    dueDate: new Date("2025-04-30"),
    labels: ["resa", "planering"],
    updates: [],
    subtasks: [],
    archived: false,
    size: "S",
  },
  {
    id: "10",
    title: "Fixa försäkringar",
    description: "Granska och uppdatera gemensamma försäkringar",
    priority: 10,
    completed: false,
    createdAt: new Date("2025-03-16"),
    updatedAt: new Date("2025-03-16"),
    dueDate: new Date("2025-04-28"),
    labels: ["ekonomi", "viktigt"],
    updates: [],
    subtasks: [],
    archived: true,
    size: "S",
  },
];

export const mockLists: List[] = [
  {
    id: "1",
    title: "Veckans mat",
    description: "Planering av mat för hela veckan",
    priority: 1,
    createdAt: new Date("2025-03-25"),
    updatedAt: new Date("2025-03-25"),
    labels: ["mat", "planering"],
    type: "unordered",
    items: [
      {
        id: "1-1",
        content: "Måndag: Pasta",
        completed: false,
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
      },
      {
        id: "1-2",
        content: "Tisdag: Tacos",
        completed: false,
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
      },
      {
        id: "1-3",
        content: "Onsdag: Soppa",
        completed: false,
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
      },
    ],
  },
  {
    id: "2",
    title: "Städplan",
    description: "Dagliga och veckovisa städrutiner",
    priority: 2,
    createdAt: new Date("2025-03-24"),
    updatedAt: new Date("2025-03-24"),
    labels: ["städning", "rutin"],
    type: "ordered",
    items: [
      {
        id: "2-1",
        content: "Dammsuga",
        completed: false,
        createdAt: new Date("2025-03-24"),
        updatedAt: new Date("2025-03-24"),
      },
      {
        id: "2-2",
        content: "Torka av köksbänk",
        completed: false,
        createdAt: new Date("2025-03-24"),
        updatedAt: new Date("2025-03-24"),
      },
      {
        id: "2-3",
        content: "Städa badrum",
        completed: false,
        createdAt: new Date("2025-03-24"),
        updatedAt: new Date("2025-03-24"),
      },
    ],
  },
  {
    id: "3",
    title: "Inköpslista",
    description: "Gemensam inköpslista för hushållet",
    priority: 3,
    createdAt: new Date("2025-03-23"),
    updatedAt: new Date("2025-03-23"),
    labels: ["inköp", "mat"],
    type: "unordered",
    items: [
      {
        id: "3-1",
        content: "Mjölk",
        completed: false,
        createdAt: new Date("2025-03-23"),
        updatedAt: new Date("2025-03-23"),
      },
      {
        id: "3-2",
        content: "Bröd",
        completed: false,
        createdAt: new Date("2025-03-23"),
        updatedAt: new Date("2025-03-23"),
      },
      {
        id: "3-3",
        content: "Frukt",
        completed: false,
        createdAt: new Date("2025-03-23"),
        updatedAt: new Date("2025-03-23"),
      },
    ],
  },
  {
    id: "4",
    title: "Betalningar",
    description: "Månadsvisa betalningar och räkningar",
    priority: 4,
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2025-03-22"),
    labels: ["ekonomi", "viktigt"],
    type: "unordered",
    items: [
      {
        id: "4-1",
        content: "Hyra",
        completed: false,
        createdAt: new Date("2025-03-22"),
        updatedAt: new Date("2025-03-22"),
      },
      {
        id: "4-2",
        content: "El",
        completed: false,
        createdAt: new Date("2025-03-22"),
        updatedAt: new Date("2025-03-22"),
      },
      {
        id: "4-3",
        content: "Internet",
        completed: false,
        createdAt: new Date("2025-03-22"),
        updatedAt: new Date("2025-03-22"),
      },
    ],
  },
  {
    id: "5",
    title: "Föräldrars födelsedagar",
    description: "Presentidéer och planering för föräldrars födelsedagar",
    priority: 5,
    createdAt: new Date("2025-03-21"),
    updatedAt: new Date("2025-03-21"),
    labels: ["socialt", "planering"],
    type: "unordered",
    items: [
      {
        id: "5-1",
        content: "Mammas födelsedag",
        completed: false,
        createdAt: new Date("2025-03-21"),
        updatedAt: new Date("2025-03-21"),
      },
      {
        id: "5-2",
        content: "Pappas födelsedag",
        completed: false,
        createdAt: new Date("2025-03-21"),
        updatedAt: new Date("2025-03-21"),
      },
      {
        id: "5-3",
        content: "Köp present",
        completed: false,
        createdAt: new Date("2025-03-21"),
        updatedAt: new Date("2025-03-21"),
      },
    ],
  },
];
