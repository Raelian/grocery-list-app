import { units, Unit } from "../types/grocery";
import { TempItem } from "../types/tempParserList";

const unitSynonyms: Record<string, Unit> = {
  kilogram: "kg", kilograms: "kg",
  gram: "g", grams: "g",
  pound: "lbs", pounds: "lbs",
  ounce: "oz", ounces: "oz",
  liter: "l", liters: "l",
  milliliter: "ml", milliliters: "ml",
  piece: "pcs", pieces: "pcs",
  unit: "", units: ""
};

const fillerWords = new Set(["of", "add", "i", "need", "want", "to", "buy", "get"]);

const numberWords: Record<string, string> = {
  one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9", ten: "10"
};

function isNumeric(str: string): boolean {
  return /^\d+([.,]?\d+)?$/.test(str);
}

function normalizeUnit(word: string): Unit | undefined {
  const lower = word.toLowerCase();
  if (units.includes(lower as Unit)) return lower as Unit;
  return unitSynonyms[lower];
}

function normalizeNumber(word: string): string {
  return numberWords[word.toLowerCase()] || word;
}

export function parseTranscriptEN(transcript: string): TempItem {
  const words = transcript
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(word => !fillerWords.has(word))
    .map(normalizeNumber);

  let quantity: string = "1";
  let unit: Unit = "";
  let item: string = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = words[i + 1];

    if (isNumeric(word) && next && normalizeUnit(next)) {
      quantity = word;
      unit = normalizeUnit(next) as Unit;
      item = words.slice(i + 2).join(" ");
      return [item.trim(), quantity, unit || undefined];
    }
  }

  if (isNumeric(words[0])) {
    quantity = words[0];
    item = words.slice(1).join(" ");
    return [item.trim(), quantity];
  }

  item = words.join(" ");
  return [item.trim()];
}
