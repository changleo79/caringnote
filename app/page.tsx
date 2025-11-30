import Link from "next/link";
import { Camera, ShoppingBag, Shield, Bell, Users, Sparkles, ArrowRight, Heart, FileText } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 overflow-hidden relative">
      {/* 고급 배경 패턴 및 레이어 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 다층 배경 그라데이션 - 더 세련된 조합 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(13,138,232,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(240,115,63,0.10),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.06),transparent_70%)]"></div>
        
        {/* 고급 Floating Elements - 더 동적이고 세련된 배치 */}
        <div className="absolute top-10 left-5 w-56 h-56 bg-gradient-to-br from-primary-400/20 to-blue-300/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-5 w-72 h-72 bg-gradient-to-br from-accent-400/20 to-orange-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-300/15 to-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-gradient-to-br from-cyan-300/12 to-blue-300/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* 메쉬 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%)]"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/90 backdrop-blur-xl text-primary-700 rounded-full text-sm font-bold mb-12 animate-fade-in-up shadow-soft-lg border border-primary-100/50">
              <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="tracking-wide">부모님의 따뜻한 하루를 함께합니다</span>
            </div>
            
            {/* Premium Logo with Enhanced Design */}
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              <div className="relative inline-block">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/30 via-accent-400/30 to-primary-400/30 rounded-3xl blur-2xl scale-125 animate-pulse-slow"></div>
                {/* Logo Container with 3D Effect */}
                <div className="relative transform hover:scale-110 transition-transform duration-700 ease-out">
                  <Logo variant="icon" size="lg" className="mx-auto relative z-10" />
                  {/* Floating Particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary-400 rounded-full animate-float opacity-70" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-accent-400 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Main Heading - Enhanced Typography with Depth */}
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 tracking-tighter leading-none relative">
                {/* Text Shadow for Depth */}
                <span className="absolute inset-0 text-gray-900/20 blur-md transform translate-x-1 translate-y-1">
                  케어링노트
                </span>
                <span className="relative block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 animate-gradient bg-[length:200%_auto] drop-shadow-xl" 
                      style={{
                        textShadow: '0 4px 20px rgba(13, 138, 232, 0.4), 0 2px 10px rgba(59, 130, 246, 0.3)',
                        WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.1)'
                      }}>
                  케어링노트
                </span>
              </h1>
              {/* Enhanced Subtitle Card */}
              <div className="relative inline-block group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-accent-100 to-primary-100 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                {/* Card */}
                <div className="relative px-8 py-3.5 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-primary-200/60 shadow-xl shadow-primary-500/20 transform group-hover:scale-105 transition-all duration-300">
                  <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-bold tracking-tight relative">
                    요양원 케어 플랫폼
                    {/* Decorative Line */}
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Description - Enhanced with Visual Elements */}
            <div className="text-xl md:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up relative" style={{ animationDelay: '0.25s' }}>
              {/* Decorative Quote Marks */}
              <div className="absolute -left-4 -top-2 text-6xl text-primary-200/40 font-serif leading-none">&ldquo;</div>
              <div className="absolute -right-4 -bottom-8 text-6xl text-accent-200/40 font-serif leading-none">&rdquo;</div>
              
              <p className="relative z-10">
                <span className="text-gray-600 relative">
                  요양원에 계신 부모님의 일상을 가족과 함께 공유하고,
                  {/* Decorative Dot */}
                  <span className="absolute -right-3 top-0 w-2 h-2 bg-primary-400 rounded-full opacity-60 animate-pulse"></span>
                </span>
                <br className="hidden md:block" />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary-700 via-accent-600 to-primary-700 bg-clip-text text-transparent font-semibold bg-[length:200%_auto] animate-gradient">
                    건강한 생활을 지원하는 통합 소통 플랫폼
                  </span>
                  {/* Underline Animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 animate-[underline_2s_ease-in-out_forwards]"></span>
                </span>입니다.
              </p>
            </div>
            
            {/* CTA Buttons - 초세련 스타일 */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-primary-500/40 hover:shadow-3xl hover:shadow-primary-500/50 hover:scale-105 overflow-hidden border-2 border-primary-500/20"
              >
                {/* 애니메이션 배경 */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center gap-2.5">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                href="/auth/login"
                className="group relative inline-flex items-center justify-center gap-3 bg-white/95 backdrop-blur-xl text-primary-600 border-2 border-primary-600/60 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50/80 hover:border-primary-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-primary-500/10 hover:shadow-2xl hover:shadow-primary-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">로그인</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 초세련 디자인 */}
      <section className="py-32 relative overflow-hidden">
        {/* 세련된 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(13,138,232,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(240,115,63,0.04),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            {/* 섹션 배지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50/80 rounded-full border border-primary-100/60 mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-primary-700 tracking-wide">핵심 기능</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tighter relative">
              <span className="relative inline-block">
                <span className="absolute inset-0 text-gray-200 blur-xl opacity-50">모든 것이</span>
                모든 것이
              </span>
              <span className="block mt-3 relative">
                <span className="absolute inset-0 text-gray-200 blur-xl opacity-50">한 곳에서</span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600">
                  한 곳에서
                </span>
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              부모님의 안전하고 행복한 생활을 위한 모든 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - Enhanced Premium Card */}
            <div className="group relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110"></div>
              
              {/* Card Container */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/80 shadow-2xl shadow-blue-500/10 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:shadow-blue-500/30 overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500" 
                     style={{
                       backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                       backgroundSize: '24px 24px'
                     }}></div>
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with 3D Effect */}
                  <div className="relative mb-8">
                    {/* Icon Shadow */}
                    <div className="absolute inset-0 bg-blue-600/30 rounded-3xl blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    {/* Icon Container */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/20">
                      {/* Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl"></div>
                      <Camera className="w-10 h-10 text-white relative z-10 drop-shadow-lg" />
                    </div>
                    {/* Floating Particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight relative">
                    사진 공유
                    {/* Decorative Line */}
                    <span className="absolute left-0 bottom-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[15px] font-medium relative z-10">
                    요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하며 추억을 나누세요.
                  </p>
                </div>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
              </div>
            </div>

            {/* Feature 2 - Enhanced Premium Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-pink-500/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110"></div>
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/80 shadow-2xl shadow-red-500/10 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:shadow-red-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500" 
                     style={{
                       backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                       backgroundSize: '24px 24px'
                     }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-red-600/30 rounded-3xl blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/40 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl"></div>
                      <Heart className="w-10 h-10 text-white relative z-10 fill-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-float opacity-60"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight relative">
                    의료 정보
                    <span className="absolute left-0 bottom-0 w-12 h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[15px] font-medium relative z-10">
                    건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하고 안심하세요.
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-pink-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
              </div>
            </div>

            {/* Feature 3 - Enhanced Premium Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110"></div>
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/80 shadow-2xl shadow-green-500/10 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:shadow-green-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500" 
                     style={{
                       backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                       backgroundSize: '24px 24px'
                     }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-green-600/30 rounded-3xl blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/40 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl"></div>
                      <ShoppingBag className="w-10 h-10 text-white relative z-10 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-float opacity-60"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-float opacity-50" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight relative">
                    생필품 구매
                    <span className="absolute left-0 bottom-0 w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[15px] font-medium relative z-10">
                    필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받아 더욱 편리하게 관리하세요.
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - 초세련 디자인 */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
        {/* 고급 배경 요소 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.02]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(13,138,232,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.06),transparent_60%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 max-w-7xl mx-auto items-center">
            <div className="animate-fade-in-up">
              {/* 섹션 배지 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50/80 rounded-full border border-primary-100/60 mb-6">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-bold text-primary-700 tracking-wide">시작하기</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight relative">
                <span className="relative inline-block">
                  <span className="absolute inset-0 text-gray-200 blur-xl opacity-40">쉽고 간편하게</span>
                  쉽고 간편하게
                </span>
                <span className="block mt-3 relative">
                  <span className="absolute inset-0 text-gray-200 blur-xl opacity-40">시작하세요</span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600">
                    시작하세요
                  </span>
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-12 leading-relaxed font-medium">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
              <div className="space-y-6">
                <div className="group relative">
                  <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/80 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-primary-200/30 rounded-2xl blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 mb-2 text-xl">요양원 선택 가입</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed font-medium">요양원을 선택하면 바로 연결됩니다</p>
                    </div>
                  </div>
                </div>
                <div className="group relative">
                  <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/80 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-amber-200/30 rounded-2xl blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                        <Bell className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 mb-2 text-xl">실시간 알림</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed font-medium">중요한 소식을 놓치지 마세요</p>
                    </div>
                  </div>
                </div>
                <div className="group relative">
                  <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/80 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-emerald-200/30 rounded-2xl blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 mb-2 text-xl">안전한 정보 관리</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed font-medium">개인정보와 의료 정보를 안전하게 보관합니다</p>
                    </div>
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

      {/* CTA Section - 초세련 디자인 */}
      <section className="py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* 고급 배경 요소 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(240,115,63,0.18),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter relative">
            <span className="absolute inset-0 text-white/20 blur-2xl">지금 바로 시작해보세요</span>
            <span className="relative">지금 바로 시작해보세요</span>
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            가족들과 함께 부모님의 행복한 일상을 공유하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center gap-3 bg-white text-primary-700 px-14 py-6 rounded-2xl font-black text-xl hover:scale-110 transition-all duration-300 shadow-3xl hover:shadow-4xl overflow-hidden border-2 border-white/20"
          >
            {/* 애니메이션 배경 */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-primary-50 bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(13,138,232,0.1)_50%,transparent_70%)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center gap-3">
              무료로 시작하기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
