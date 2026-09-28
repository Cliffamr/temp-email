/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');

const {
    calculateClockOffset,
    generateTOTP,
    getTOTPTimeStep,
    shouldRefreshTOTP,
} = require('../.test-dist/totp.js');

test('calculates server clock offset from the request midpoint', () => {
    assert.equal(calculateClockOffset(10_000, 1_000, 3_000), 8_000);
});

test('generates the RFC 6238 SHA-1 vector at an explicit timestamp', () => {
    assert.equal(
        generateTOTP('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', { timestamp: 59_000 }),
        '287082'
    );
});

test('detects a TOTP period change even when the boundary tick was skipped', () => {
    const previousTimeStep = getTOTPTimeStep(29_900);

    assert.equal(shouldRefreshTOTP(previousTimeStep, 29_999), false);
    assert.equal(shouldRefreshTOTP(previousTimeStep, 31_100), true);
});