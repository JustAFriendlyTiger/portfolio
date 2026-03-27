"use client";

import { useState } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "education" | "work" | "competition" | "project";
}

interface TimelineFormProps {
  initial: TimelineEvent[];
  action: (formData: FormData) => Promise<void>;
}

const empty: TimelineEvent = { year: "", title: "", description: "", type: "education" };

export default function TimelineForm({ initial, action }: TimelineFormProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    initial.length > 0 ? initial : [{ ...empty }]
  );
  const [pending, setPending] = useState(false);

  function addEvent() {
    setEvents([...events, { ...empty }]);
  }

  function removeEvent(i: number) {
    setEvents(events.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof TimelineEvent, value: string) {
    setEvents(events.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData();
    formData.set("timeline", JSON.stringify(events.filter((ev) => ev.title.trim())));
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors";
  const labelClass = "block text-xs text-zinc-400 mb-1";
  const selectClass = inputClass + " cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {events.map((ev, i) => (
        <div key={i} className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>Year</label>
              <input
                className={inputClass}
                placeholder="2024"
                value={ev.year}
                onChange={(e) => update(i, "year", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                placeholder="Started B.S. Mechanical Engineering"
                value={ev.title}
                onChange={(e) => update(i, "title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={selectClass}
                value={ev.type}
                onChange={(e) => update(i, "type", e.target.value as TimelineEvent["type"])}
              >
                <option value="education">Education</option>
                <option value="work">Work</option>
                <option value="competition">Competition</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <input
              className={inputClass}
              placeholder="Short description…"
              value={ev.description}
              onChange={(e) => update(i, "description", e.target.value)}
            />
          </div>
          {events.length > 1 && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => removeEvent(i)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addEvent}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add Event
      </button>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save Timeline"}
        </button>
      </div>
    </form>
  );
}
