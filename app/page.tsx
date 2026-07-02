import Link from "next/link";
import {
  Camera,
  ShoppingBag,
  Shield,
  Bell,
  Users,
  ArrowRight,
  Heart,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/brand/Logo";

const features = [
  {
    icon: Camera,
    title: "일상 기록",
    description: "요양원에서 부모님의 일상을 사진으로 공유하고, 가족들과 댓글로 소통하세요.",
    color: "bg-brand-50 text-brand-600",
  },
  {
    icon: Heart,
    title: "의료 정보",
    description: "건강 상태와 진료 기록을 투명하게 공유하여, 언제든지 부모님의 건강을 확인하세요.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: ShoppingBag,
    title: "생필품 구매",
    description: "필요한 생필품을 앱에서 쉽게 구매하고, 요양원으로 직접 배송받으세요.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const benefits = [
  { icon: Users, title: "요양원 선택 가입", desc: "요양원을 선택하면 바로 연결됩니다" },
  { icon: Bell, title: "실시간 알림", desc: "중요한 소식을 놓치지 마세요" },
  { icon: Shield, title: "안전한 정보 관리", desc: "개인정보와 의료 정보를 안전하게 보관합니다" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <header className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-16">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-body px-4 py-2 min-h-0">
              로그인
            </Link>
            <Link href="/auth/signup" className="btn-primary text-body px-5 py-2 min-h-0">
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="section-container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-caption font-medium mb-8">
            <FileText className="w-4 h-4" />
            요양원 케어 플랫폼
          </div>

          <div className="flex justify-center mb-8">
            <Logo size="lg" href="/" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
            부모님의 일상을<br />
            <span className="text-brand-600">가족과 함께</span> 기록하세요
          </h1>

          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            실버노트는 요양원에 계신 부모님의 일상을 가족과 함께 공유하고,
            건강한 생활을 지원하는 통합 소통 플랫폼입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-body-lg px-8">
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="btn-secondary text-body-lg px-8">
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
            모든 것이 한 곳에서
          </h2>
          <p className="text-body-lg text-neutral-500">
            부모님의 안전하고 행복한 생활을 위한 모든 기능
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card p-8 card-interactive">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-subheading text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-body text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-y border-neutral-200/80">
        <div className="section-container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
                쉽고 간편하게 시작하세요
              </h2>
              <p className="text-body-lg text-neutral-500 mb-8 leading-relaxed">
                복잡한 가입 절차 없이 요양원을 선택하고 바로 시작할 수 있습니다.
                큰 글씨와 직관적인 화면으로 누구나 쉽게 사용할 수 있습니다.
              </p>
              <ul className="space-y-4">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <li key={b.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{b.title}</p>
                        <p className="text-body text-neutral-500">{b.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="card p-6 shadow-elevated">
              <div className="flex items-center gap-3 pb-5 border-b border-neutral-100 mb-5">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">김부모님</p>
                  <p className="text-caption text-neutral-500">오늘도 건강하세요!</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { text: "오늘의 식사 사진이 공유되었습니다", color: "bg-emerald-50 text-emerald-700" },
                  { text: "건강 검진 일정이 등록되었습니다", color: "bg-brand-50 text-brand-700" },
                  { text: "새로운 댓글이 달렸습니다", color: "bg-amber-50 text-amber-700" },
                ].map((item) => (
                  <div key={item.text} className={`flex items-center gap-3 p-3 rounded-xl text-body ${item.color}`}>
                    <div className="w-2 h-2 rounded-full bg-current opacity-60 flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center card p-12 bg-brand-600 border-brand-700 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            지금 바로 시작해보세요
          </h2>
          <p className="text-body-lg text-brand-100 mb-8 leading-relaxed">
            가족들과 함께 부모님의 행복한 일상을 기록하고, 건강한 생활을 지원하세요.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-semibold text-body-lg hover:bg-brand-50 transition-colors"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white">
        <div className="section-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" href="/" />
          <p className="text-caption text-neutral-400">
            © {new Date().getFullYear()} Silver Note. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
