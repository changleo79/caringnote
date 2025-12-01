import Link from "next/link";
import { Camera, ShoppingBag, Shield, Bell, Users, ArrowRight, Heart, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/30">
      {/* Hero Section - 프리미엄 느낌 */}
      <section className="relative overflow-hidden border-b-4 border-primary-200/50">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 bg-pattern-grid opacity-20"></div>
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/60 via-white/80 to-accent-100/40"></div>
        
        {/* 배경 장식 */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl animate-float-subtle"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl animate-float-subtle" style={{ animationDelay: '3s' }}></div>
        
        <div className="section-container py-32 md:py-48 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - 프리미엄 느낌 */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full mb-12 animate-in shadow-xl border-2 border-primary-200/50">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-black text-primary-700">요양원 케어 플랫폼</span>
            </div>
            
            {/* Logo */}
            <div className="mb-12 animate-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl inline-block border-2 border-primary-200/50">
                <Logo variant="icon" size="lg" className="mx-auto" />
              </div>
            </div>
            
            {/* Main Heading - 프리미엄 타이포그래피 */}
            <div className="mb-12 animate-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-neutral-900 mb-8 tracking-tight leading-[1.1]">
                케어링노트
              </h1>
              <p className="text-2xl md:text-3xl text-neutral-700 max-w-3xl mx-auto leading-relaxed font-black">
                부모님의 일상을 가족과 함께 공유하고,<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">건강한 생활을 지원하는</span> 통합 소통 플랫폼
              </p>
            </div>
            
            {/* CTA Buttons - 프리미엄 느낌 */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/auth/signup"
                className="btn-primary inline-flex items-center gap-3 px-12 py-6 text-lg"
              >
                무료로 시작하기
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/auth/login"
                className="btn-secondary inline-flex items-center gap-3 px-12 py-6 text-lg"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Linear 스타일 */}
      <section className="section-container py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 mb-4 tracking-tight">
              모든 것이 한 곳에서
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              부모님의 안전하고 행복한 생활을 위한 모든 기능
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="card-app p-10 card-hover-linear group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-all duration-700">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-neutral-900 mb-4">
                사진 공유
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed font-medium">
                요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-app p-10 card-hover-linear group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-red-500/40 group-hover:scale-110 transition-all duration-700">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h3 className="text-3xl font-black text-neutral-900 mb-4">
                의료 정보
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed font-medium">
                건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-app p-10 card-hover-linear group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-green-500/40 group-hover:scale-110 transition-all duration-700">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-neutral-900 mb-4">
                생필품 구매
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed font-medium">
                필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받아 더욱 편리하게 관리하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Vercel 스타일 */}
      <section className="section-container py-24 md:py-32 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 mb-6 tracking-tight">
                쉽고 간편하게 시작하세요
              </h2>
              <p className="text-lg text-neutral-600 mb-12 leading-relaxed">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.<br />
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">요양원 선택 가입</h4>
                    <p className="text-sm text-neutral-600">요양원을 선택하면 바로 연결됩니다</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">실시간 알림</h4>
                    <p className="text-sm text-neutral-600">중요한 소식을 놓치지 마세요</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">안전한 정보 관리</h4>
                    <p className="text-sm text-neutral-600">개인정보와 의료 정보를 안전하게 보관합니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="card-notion p-6 shadow-notion-lg">
                <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Logo variant="icon" size="sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">김부모님</h4>
                    <p className="text-sm text-neutral-600">오늘도 건강하세요!</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-neutral-800">오늘의 식사 사진이 공유되었습니다</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-neutral-800">건강 검진 일정이 등록되었습니다</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-neutral-800">새로운 댓글이 달렸습니다</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Notion 스타일 */}
      <section className="section-container py-24 md:py-32 bg-neutral-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            지금 바로 시작해보세요
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            무료로 시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
