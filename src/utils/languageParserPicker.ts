import { parseTranscriptEN } from "./englishVoiceParser";
import { parseTranscriptRO } from "./romanianVoiceParser";
import { TempItem } from "../types/tempParserList";

export function parseTranscript(transcript: string, lang: string): TempItem {
  if (lang.startsWith("ro")) {
    return parseTranscriptRO(transcript);
  }
  return parseTranscriptEN(transcript);
}
