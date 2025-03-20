export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
};