// utils/parsers/romanianVoiceParser.ts
import { units, Unit } from "../types/grocery";
import { TempItem } from "../types/tempParserList";

const unitSynonyms: Record<string, Unit> = {
  kilogram: "kg", kilograme: "kg",
  gram: "g", grame: "g",
  litru: "l", litri: "l",
  mililitru: "ml", mililitri: "ml",
  bucata: "buc", bucati: "buc", bucăți: "buc",
  unitate: "", unități: ""
};

const fillerWords = new Set(["de", "vreau", "să", "sa", "cumpar", "cumpăr", "adaug", "am", "nevoie", "la"]);

const numberWords: Record<string, string> = {
  unu: "1", una: "1", doi: "2", două: "2",
  trei: "3", patru: "4", cinci: "5", șase: "6", sase: "6",
  șapte: "7", sapte: "7", opt: "8", nouă: "9", noua: "9", zece: "10"
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

export function parseTranscriptRO(transcript: string): TempItem {
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
