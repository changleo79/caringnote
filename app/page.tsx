import Link from "next/link";
import { Heart, Camera, ShoppingBag, Shield, Bell, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-soft">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Heart className="w-4 h-4" />
              <span>부모님의 따뜻한 하루를 함께합니다</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
              요양원 케어
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                플랫폼
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              요양원에 계신 부모님의 일상을 가족과 함께 공유하고,<br />
              건강한 생활을 지원하는 통합 소통 플랫폼입니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link
                href="/auth/signup"
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                무료로 시작하기
                <span className="text-lg">→</span>
              </Link>
              <Link
                href="/auth/login"
                className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-200 rounded-full opacity-20 blur-3xl animate-pulse delay-300"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              모든 것이 한 곳에서
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              부모님의 안전하고 행복한 생활을 위한 모든 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 card-hover border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">사진 공유</h3>
              <p className="text-gray-600 leading-relaxed">
                요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 card-hover border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">의료 정보</h3>
              <p className="text-gray-600 leading-relaxed">
                건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 card-hover border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">생필품 구매</h3>
              <p className="text-gray-600 leading-relaxed">
                필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받아 더욱 편리하게 관리하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                쉽고 간편하게
                <span className="block text-primary-600">시작하세요</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">요양원 선택 가입</h4>
                    <p className="text-gray-600 text-sm">요양원을 선택하면 바로 연결됩니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">실시간 알림</h4>
                    <p className="text-gray-600 text-sm">중요한 소식을 놓치지 마세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">안전한 정보 관리</h4>
                    <p className="text-gray-600 text-sm">개인정보와 의료 정보를 안전하게 보관합니다</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 shadow-soft-lg">
              <div className="bg-white rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">김부모님</h4>
                    <p className="text-sm text-gray-500">오늘도 건강하세요!</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">오늘의 식사 사진이 공유되었습니다</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">건강 검진 일정이 등록되었습니다</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">새로운 댓글이 달렸습니다</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            무료로 시작하기
            <span className="text-xl">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
