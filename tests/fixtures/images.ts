/**
 * Test image fixtures for E2E tests
 */

import path from 'path';

const fixturesDir = path.join(process.cwd(), 'tests/fixtures/images');

export const testImages = {
  validJpg: path.join(fixturesDir, 'test-image.jpg'),
  validPng: path.join(fixturesDir, 'test-image.png'),
  validWebp: path.join(fixturesDir, 'test-image.webp'),
  oversized: path.join(fixturesDir, 'large.jpg'),     // 6MB (should fail)
  invalidFormat: path.join(fixturesDir, 'test.gif')    // GIF (should fail)
} as const;

/**
 * Expected file sizes (approximate)
 */
export const expectedFileSizes = {
  validJpg: 1024 * 1024,      // 1MB
  validPng: 800 * 1024,       // 800KB
  validWebp: 500 * 1024,      // 500KB
  oversized: 6 * 1024 * 1024, // 6MB
  invalidFormat: 100 * 1024   // 100KB
} as const;

/**
 * Max file size allowed (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image formats
 */
export const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
