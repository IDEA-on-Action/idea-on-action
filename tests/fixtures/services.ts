/**
 * Test service fixtures for E2E tests
 */

export const mockService = {
  name: 'E2E 테스트 서비스',
  description: 'Playwright 자동화 테스트용 서비스입니다. 이 서비스는 테스트 후 자동으로 삭제됩니다.',
  category: 'AI Solutions',
  price: 150000,
  duration: '4주',
  features: ['자동화 테스트', 'E2E 검증', 'CI/CD 통합'],
  status: 'active'
} as const;

export const mockServiceUpdate = {
  name: 'E2E 테스트 서비스 (수정됨)',
  description: '수정된 설명입니다.',
  category: 'Consulting',
  price: 200000,
  duration: '6주',
  features: ['수정된 기능 1', '수정된 기능 2'],
  status: 'inactive'
} as const;

/**
 * Generate unique service name for parallel test execution
 */
export function generateUniqueServiceName(prefix = 'E2E 테스트') {
  const timestamp = Date.now();
  return `${prefix} - ${timestamp}`;
}
