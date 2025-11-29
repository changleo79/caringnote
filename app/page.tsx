import Link from "next/link";
import { Heart, Camera, ShoppingBag, Shield, Bell, Users, Sparkles, ArrowRight } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-soft overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,138,232,0.05),transparent_50%)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md text-primary-700 rounded-full text-sm font-semibold mb-10 animate-fade-in-up shadow-soft border border-primary-100">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>부모님의 따뜻한 하루를 함께합니다</span>
            </div>
            
            {/* Logo - 아이콘만 */}
            <div className="mb-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <BrandMark size={80} />
            </div>
            
            {/* Main Heading - 브랜드 이름과 캐치프레이즈 */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 animate-gradient bg-[length:200%_auto]">
                  케어링노트
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-4">
                요양원 케어 플랫폼
              </p>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              요양원에 계신 부모님의 일상을 가족과 함께 공유하고,<br className="hidden md:block" />
              건강한 생활을 지원하는 통합 소통 플랫폼입니다.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105"
              >
                <span>무료로 시작하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 border-2 border-primary-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-200"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/60 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              모든 것이
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                한 곳에서
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              부모님의 안전하고 행복한 생활을 위한 모든 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-white rounded-3xl p-10 shadow-soft border border-gray-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">사진 공유</h3>
              <p className="text-gray-600 leading-relaxed">
                요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-3xl p-10 shadow-soft border border-gray-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">의료 정보</h3>
              <p className="text-gray-600 leading-relaxed">
                건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-3xl p-10 shadow-soft border border-gray-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-white" />
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
      <section className="py-24 gradient-soft relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                쉽고 간편하게
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 mt-2">
                  시작하세요
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">요양원 선택 가입</h4>
                    <p className="text-gray-600 text-sm">요양원을 선택하면 바로 연결됩니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">실시간 알림</h4>
                    <p className="text-gray-600 text-sm">중요한 소식을 놓치지 마세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">안전한 정보 관리</h4>
                    <p className="text-gray-600 text-sm">개인정보와 의료 정보를 안전하게 보관합니다</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 shadow-2xl shadow-primary-500/30">
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                      <Heart className="w-7 h-7 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">김부모님</h4>
                      <p className="text-sm text-gray-500">오늘도 건강하세요!</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm p-3 bg-green-50 rounded-xl">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-medium">오늘의 식사 사진이 공유되었습니다</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 bg-blue-50 rounded-xl">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-medium">건강 검진 일정이 등록되었습니다</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 bg-purple-50 rounded-xl">
                      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-medium">새로운 댓글이 달렸습니다</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-primary-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            <span>무료로 시작하기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
