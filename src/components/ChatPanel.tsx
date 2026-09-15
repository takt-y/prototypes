import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Conversation, Person } from '../types/job'

interface ChatPanelProps {
  person: Person
  conversation: Conversation | undefined
  onSend: (text: string) => void
  onClose: () => void
}

export function ChatPanel({ person, conversation, onSend, onClose }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [conversation?.messages.length])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-sm flex-col bg-white shadow-xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">{person.name}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
        <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
          {(conversation?.messages ?? []).map((message) => (
            <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <span
                className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm ${
                  message.from === 'me'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
          {(conversation?.messages.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-400">Say hello to {person.name.split(' ')[0]}.</p>
          ) : null}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
