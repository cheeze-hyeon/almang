"use client";

export default function SidebarDummy() {
  return (
    <aside className="p-4">
      <div className="sticky top-4 space-y-4">
        {["🏠", "🧾", "⚙️", "📩", "🔔", "📦"].map((icon, i) => (
          <button
            key={i}
            disabled
            className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-xl opacity-70 cursor-default"
          >
            {icon}
          </button>
        ))}
      </div>
    </aside>
  );
}
