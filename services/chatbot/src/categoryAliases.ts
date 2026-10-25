/**
 * Resolves a bare category message ("Camer", "dron", "камера", "Gar tuhuurumj")
 * to its DB category name. Only fires when the WHOLE message is a category word,
 * so "DJI Air 3S camera lens" etc. still go through normal product matching.
 * Tolerates one typo (edit distance 1) on Latin aliases of 4+ letters.
 */

const CATEGORY_ALIASES: { category: string; aliases: string[] }[] = [
  {
    category: "Дрон",
    aliases: ["дрон", "дронууд", "дроны", "drone", "drones", "dron", "drona", "dronuud", "dronnuud"],
  },
  {
    category: "Камер",
    aliases: ["камер", "камера", "камерууд", "camera", "cameras", "camer", "cam", "kamer", "kamera", "kameruud"],
  },
  {
    category: "Гар төхөөрөмж",
    aliases: ["гар төхөөрөмж", "гар тохооромж", "gar tuhuurumj", "gar tohooromj", "gar tuhuuromj", "handheld"],
  },
  {
    category: "Дагалдах хэрэгсэл",
    aliases: [
      "дагалдах", "дагалдах хэрэгсэл", "дагалдах хэрэгслүүд",
      "dagaldah", "dagaldah heregsel", "dagaldah hergsel", "accessories", "accessory",
    ],
  },
  {
    category: "Power",
    aliases: ["power", "пауэр", "power station", "цахилгаан станц"],
  },
];

function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // "Drón" → "dron"
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withinOneEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export function resolveCategory(message: string): string | null {
  const text = normalise(message);
  if (!text || text.split(" ").length > 3) return null;

  for (const { category, aliases } of CATEGORY_ALIASES) {
    if (aliases.includes(text)) return category;
  }

  // One-typo tolerance, Latin only (Cyrillic aliases are short and collide easily)
  if (/^[a-z ]{4,}$/.test(text)) {
    for (const { category, aliases } of CATEGORY_ALIASES) {
      if (aliases.some((a) => /^[a-z ]+$/.test(a) && a.length >= 4 && withinOneEdit(text, a))) {
        return category;
      }
    }
  }

  return null;
}
