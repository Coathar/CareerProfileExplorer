export function getRoundedHoursFromSeconds(seconds: number) {
    return Math.round(seconds / 60 / 60);
}