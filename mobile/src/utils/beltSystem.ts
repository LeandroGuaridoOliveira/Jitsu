import { Belt, BeltColor } from '../types/domain';

const BELT_ORDER: BeltColor[] = [
    'WHITE',
    'GREY_WHITE', 'GREY', 'GREY_BLACK',
    'YELLOW_WHITE', 'YELLOW', 'YELLOW_BLACK',
    'ORANGE_WHITE', 'ORANGE', 'ORANGE_BLACK',
    'GREEN_WHITE', 'GREEN', 'GREEN_BLACK',
    'BLUE',
    'PURPLE',
    'BROWN',
    'BLACK',
    'RED_BLACK', 'RED_WHITE', 'RED'
];

export function getBeltRank(color: BeltColor): number {
    return BELT_ORDER.indexOf(color);
}

export function isHigherBelt(a: BeltColor, b: BeltColor): boolean {
    return getBeltRank(a) > getBeltRank(b);
}

export function getNextBelt(color: BeltColor): BeltColor | null {
    const index = BELT_ORDER.indexOf(color);
    if (index === -1 || index === BELT_ORDER.length - 1) return null;
    return BELT_ORDER[index + 1];
}

export function calculateTimeInGrade(awardedAt: string): number {
    const start = new Date(awardedAt).getTime();
    const now = Date.now();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // Months roughly
}

export function formatBeltName(color: BeltColor): string {
    return color.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
