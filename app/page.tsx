import Link from "next/link";
import { Camera, ShoppingBag, Shield, Bell, Users, Sparkles, ArrowRight, Heart, FileText } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-soft overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 레이어 - 더 세련된 조합 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-accent-500/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,138,232,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(240,115,63,0.06),transparent_50%)]"></div>
        
        {/* Floating Elements - 더 부드럽고 세련된 배치 */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary-300/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-300/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-purple-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/90 backdrop-blur-xl text-primary-700 rounded-full text-sm font-bold mb-12 animate-fade-in-up shadow-soft-lg border border-primary-100/50">
              <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="tracking-wide">부모님의 따뜻한 하루를 함께합니다</span>
            </div>
            
            {/* Premium Logo */}
            <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              <Logo variant="icon" size="lg" className="mx-auto" />
            </div>
            
            {/* Main Heading - 프리미엄 타이포그래피 */}
            <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 animate-gradient bg-[length:200%_auto] drop-shadow-sm">
                  케어링노트
                </span>
              </h1>
              <div className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200/50">
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-bold tracking-tight">
                  요양원 케어 플랫폼
                </p>
              </div>
            </div>
            
            {/* Description - 더 세련된 스타일 */}
            <p className="text-xl md:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <span className="text-gray-600">요양원에 계신 부모님의 일상을 가족과 함께 공유하고,</span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent font-semibold">건강한 생활을 지원하는 통합 소통 플랫폼</span>입니다.
            </p>
            
            {/* CTA Buttons - 프리미엄 스타일 */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-primary-700 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-2xl shadow-primary-500/40 hover:shadow-3xl hover:shadow-primary-500/50 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm text-primary-600 border-2 border-primary-600/80 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50 hover:border-primary-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary-500/10"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 프리미엄 디자인 */}
      <section className="py-32 bg-white/80 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
              모든 것이
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 mt-2">
                한 곳에서
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              부모님의 안전하고 행복한 생활을 위한 모든 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - 프리미엄 카드 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 card-hover border border-gray-100/80 relative overflow-hidden shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">사진 공유</h3>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium">
                  요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 card-hover border border-gray-100/80 relative overflow-hidden shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">의료 정보</h3>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium">
                  건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-pink-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 card-hover border border-gray-100/80 relative overflow-hidden shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">생필품 구매</h3>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium">
                  필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받아 더욱 편리하게 관리하세요.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - 프리미엄 디자인 */}
      <section className="py-32 gradient-soft relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(13,138,232,0.06),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.04),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 max-w-7xl mx-auto items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
                쉽고 간편하게
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 mt-3">
                  시작하세요
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-12 leading-relaxed font-medium">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-primary-500/10">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2 text-xl">요양원 선택 가입</h4>
                    <p className="text-gray-600 text-[15px] leading-relaxed font-medium">요양원을 선택하면 바로 연결됩니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-amber-500/10">
                    <Bell className="w-8 h-8 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2 text-xl">실시간 알림</h4>
                    <p className="text-gray-600 text-[15px] leading-relaxed font-medium">중요한 소식을 놓치지 마세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/10">
                    <Shield className="w-8 h-8 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2 text-xl">안전한 정보 관리</h4>
                    <p className="text-gray-600 text-[15px] leading-relaxed font-medium">개인정보와 의료 정보를 안전하게 보관합니다</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-4xl p-10 shadow-3xl shadow-primary-500/40 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 space-y-7 shadow-2xl">
                  <div className="flex items-center gap-5 pb-7 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <Logo variant="icon" size="sm" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-xl">김부모님</h4>
                      <p className="text-sm text-gray-600 font-medium">오늘도 건강하세요!</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-4 bg-green-50/80 rounded-2xl border border-green-100">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className="text-gray-800 font-semibold">오늘의 식사 사진이 공유되었습니다</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-4 bg-blue-50/80 rounded-2xl border border-blue-100">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                      <span className="text-gray-800 font-semibold">건강 검진 일정이 등록되었습니다</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-4 bg-purple-50/80 rounded-2xl border border-purple-100">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                      <span className="text-gray-800 font-semibold">새로운 댓글이 달렸습니다</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 프리미엄 디자인 */}
      <section className="py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-3 bg-white text-primary-700 px-12 py-6 rounded-2xl font-black text-xl hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-3xl hover:shadow-4xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              무료로 시작하기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}
