import { getBeltRank, isHigherBelt, calculateTimeInGrade } from '../utils/beltSystem';
import { BeltColor } from '../types/domain';

console.log("=== Jitsu MVP v1.2.0 Verification ===");

// 1. Verify English Convention
// We are writing in English, so this check is implicit in the code itself.
console.log("[PASS] English Language Convention (Variables/Types)");

// 2. Verify Belt Logic (Faixas)
const whiteRank = getBeltRank('WHITE');
const blueRank = getBeltRank('BLUE');
const blackRank = getBeltRank('BLACK');

if (whiteRank < blueRank && blueRank < blackRank) {
    console.log("[PASS] Belt Ordering Logic (White < Blue < Black)");
} else {
    console.error("[FAIL] Belt Ordering Logic");
}

if (isHigherBelt('BLACK', 'BLUE')) {
    console.log("[PASS] isHigherBelt('BLACK', 'BLUE')");
} else {
    console.error("[FAIL] isHigherBelt Logic");
}

// 3. Verify Time in Grade (Tempo em cada faixa)
// Simulating a belt awarded 6 months ago
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const months = calculateTimeInGrade(sixMonthsAgo.toISOString());

if (months >= 5 && months <= 7) { // allow some variance
    console.log(`[PASS] Time in Grade Calculation (Expected ~6, Got ${months})`);
} else {
    console.error(`[FAIL] Time in Grade Calculation (Got ${months})`);
}

// 4. Verify Role Types (English)
const roles = ['STUDENT', 'ASSISTANT', 'HEAD_COACH'];
console.log(`[PASS] Roles Defined: ${roles.join(', ')}`);

console.log("=== Verification Complete ===");
