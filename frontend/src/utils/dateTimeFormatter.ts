const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

export function formatTimestamp(value: string) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : dateTimeFormatter.format(parsed);
}