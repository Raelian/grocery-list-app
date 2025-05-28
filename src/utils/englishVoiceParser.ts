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
  one: "1", won: "1",
  two: "2", to: "2", too: "2",
  three: "3", free: "3",
  four: "4", for: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8", ate: "8",
  nine: "9",
  ten: "10"
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

  if(isNumeric(words[words.length - 1])) { //checks for number last ex: "potatoes 3"
    quantity = words[words.length - 1];
    item = words.slice(0, words.length - 1).join(" ");
    return [item.trim(), quantity]
  }

  if(isNumeric(words[words.length - 2]) && normalizeUnit(words[words.length - 1])) { //checks if last is unit and second last is number ex: "potatoes 3 kg"
    quantity = words[words.length - 2];
    unit = normalizeUnit(words[words.length - 1]) as Unit;
    item = words.slice(0 , words.length - 2).join(" ");
    return [item.trim(), quantity, unit];
  }

  for(let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = words[i + 1];

    if(isNumeric(word) && next && normalizeUnit(next)) { //checks for number = word and unit = next, slices the rest as item ex: "3 kg of sweet potatoes"
      quantity = word;
      unit = normalizeUnit(next) as Unit;
      item = words.slice(i + 2).join(" ");
      return [item.trim(), quantity, unit || undefined];
    }
  }

  if(isNumeric(words[0])) { //checks for number first ex: "3 potatoes"
    quantity = words[0];
    item = words.slice(1).join(" ");
    return [item.trim(), quantity];
  }

  item = words.join(" "); //has no numbers of units so it's just words ex: "potatoes" or "sweet potatoes in a can"
  return [item.trim()];
}
