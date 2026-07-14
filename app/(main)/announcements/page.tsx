"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

export default function AnnouncementsPage() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const [list, setList] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)

  const load = () =>
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isUrgent }),
    })
    if (res.ok) {
      toast.success("공지를 올렸습니다.")
      setTitle("")
      setContent("")
      setIsUrgent(false)
      load()
    } else toast.error("작성 실패")
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">공지사항</h1>
        <p className="page-description">시설 소식을 한곳에</p>
      </div>

      {isStaff && (
        <form onSubmit={submit} className="card p-5 space-y-3 mb-6">
          <input className="input" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="input min-h-[100px]" placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
            긴급 공지
          </label>
          <button className="btn-primary w-full" type="submit">게시</button>
        </form>
      )}

      <ul className="space-y-3">
        {list.map((a) => (
          <li key={a.id} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              {a.isUrgent && <span className="chip-caution">긴급</span>}
              <h2 className="font-semibold text-neutral-900">{a.title}</h2>
            </div>
            <p className="text-neutral-600 whitespace-pre-wrap">{a.content}</p>
            <p className="text-xs text-neutral-400 mt-2">{new Date(a.createdAt).toLocaleString("ko-KR")}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
