export function cleanInput(input: string): string {
    return input
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[<>]/g, '')
        .replace(/[\u0000-\u001F\u007F]/g, '');
}