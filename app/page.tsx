import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            요양원 케어 플랫폼
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            부모님의 안전하고 따뜻한 생활을 위한 통합 소통 플랫폼
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">📸</div>
            <h2 className="text-2xl font-semibold mb-4">사진 공유</h2>
            <p className="text-gray-600">
              요양원에서 부모님의 일상을 사진으로 공유하고 가족들과 소통하세요.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">🏥</div>
            <h2 className="text-2xl font-semibold mb-4">의료 정보</h2>
            <p className="text-gray-600">
              건강 상태와 진료 기록을 투명하게 공유하여 안심하세요.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">생필품 구매</h2>
            <p className="text-gray-600">
              필요한 생필품을 편리하게 구매하고 요양원으로 직접 배송받으세요.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">주요 기능</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">실시간 알림</h3>
              <p className="text-gray-600 text-sm">
                중요한 소식과 업데이트를 실시간으로 받아보세요.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">요양원 선택 가입</h3>
              <p className="text-gray-600 text-sm">
                요양원을 선택하여 간편하게 가입하고 연결하세요.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">안전한 정보 관리</h3>
              <p className="text-gray-600 text-sm">
                개인정보와 의료 정보를 안전하게 보관합니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">쉬운 사용법</h3>
              <p className="text-gray-600 text-sm">
                누구나 쉽게 사용할 수 있는 직관적인 인터페이스.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

