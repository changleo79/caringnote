#!/usr/bin/env node
// 자동 배포 스크립트 (Node.js - 모든 플랫폼 지원)

const { execSync } = require('child_process');
const path = require('path');

// 커밋 메시지 (인자로 받거나 기본값 사용)
const message = process.argv[2] || `자동 배포: ${new Date().toLocaleString('ko-KR')}`;

console.log('🚀 자동 배포를 시작합니다...\n');

try {
  // 1. 변경사항 확인
  console.log('📝 변경사항 확인 중...');
  const status = execSync('git status --short', { encoding: 'utf-8' });
  
  if (!status.trim()) {
    console.log('⚠️  변경사항이 없습니다. 배포를 건너뜁니다.');
    process.exit(0);
  }

  console.log('변경된 파일:');
  console.log(status);

  // 2. 모든 파일 추가
  console.log('\n📦 변경사항 스테이징 중...');
  execSync('git add .', { stdio: 'inherit' });

  // 3. 커밋
  console.log('💾 커밋 생성 중...');
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

  // 4. 푸시
  console.log('📤 GitHub에 푸시 중...');
  try {
    execSync('git push', { stdio: 'inherit' });
  } catch (error) {
    // 업스트림 설정 후 재시도
    console.log('업스트림 브랜치 설정 중...');
    execSync('git push --set-upstream origin main', { stdio: 'inherit' });
  }

  console.log('\n✅ 배포 완료!');
  console.log('Vercel이 자동으로 재배포를 시작합니다...');
  console.log('대시보드: https://vercel.com/dashboard\n');

} catch (error) {
  console.error('\n❌ 배포 중 오류가 발생했습니다:', error.message);
  process.exit(1);
}

