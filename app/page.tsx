import Link from "next/link";
import { Heart, Camera, ShoppingBag, Shield, Bell, Users, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-soft overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,138,232,0.05),transparent_50%)]"></div>
        
        {/* Floating Elements - 더 세련된 배치 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md text-primary-700 rounded-full text-sm font-semibold mb-8 animate-fade-in-up shadow-soft border border-primary-100">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>부모님의 따뜻한 하루를 함께합니다</span>
            </div>
            
            {/* Logo */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <Logo variant="default" size="lg" className="justify-center" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 animate-gradient bg-[length:200%_auto]">
                케어링노트
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              요양원에 계신 부모님의 일상을 가족과 함께 공유하고,<br className="hidden md:block" />
              <span className="text-gray-700 font-medium">건강한 생활을 지원하는 통합 소통 플랫폼</span>입니다.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/auth/signup"
                className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4 relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  무료로 시작하기
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/auth/login"
                className="btn-secondary inline-flex items-center gap-2 text-lg px-10 py-4"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 개선된 디자인 */}
      <section className="py-24 bg-white/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 tracking-tight">
              모든 것이
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                한 곳에서
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              부모님의 안전하고 행복한 생활을 위한 모든 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-white rounded-3xl p-10 card-hover border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">사진 공유</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-3xl p-10 card-hover border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">의료 정보</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-3xl p-10 card-hover border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">생필품 구매</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받아 더욱 편리하게 관리하세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - 더 세련된 디자인 */}
      <section className="py-24 gradient-soft relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
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
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Users className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">요양원 선택 가입</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">요양원을 선택하면 바로 연결됩니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Bell className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">실시간 알림</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">중요한 소식을 놓치지 마세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Shield className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-lg">안전한 정보 관리</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">개인정보와 의료 정보를 안전하게 보관합니다</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-4xl p-8 shadow-2xl shadow-primary-500/30 transform hover:scale-[1.02] transition-transform">
                <div className="bg-white rounded-3xl p-8 space-y-6 shadow-xl">
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-md">
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

      {/* CTA Section - 더 강렬한 디자인 */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-primary-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl relative group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              무료로 시작하기
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}
