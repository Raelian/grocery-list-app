export function cleanInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
}