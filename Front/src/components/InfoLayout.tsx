"use client";

export default function InfoLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white pb-20 font-sans">
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-magnolia-dark mb-4 tracking-tight">
            {title}
          </h1>
          <div className="w-12 h-1 bg-magnolia-lilac/30 mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl mt-16 prose prose-sm prose-gray">
        <div className="space-y-8 text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </main>
  );
}