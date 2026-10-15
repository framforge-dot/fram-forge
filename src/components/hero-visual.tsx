import { ArrowUpRight, Check, MousePointer2 } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="animate-fade-up delay-4 relative mx-auto w-full max-w-lg py-8" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-paper/20 bg-ink shadow-[0_30px_100px_-30px_rgba(255,255,255,0.12)] lg:-rotate-2">
        <div className="flex items-center gap-1.5 border-b border-line px-5 py-4">
          {[1,2,3].map(i => <span key={i} className="h-2 w-2 rounded-full bg-paper/25" />)}
          <span className="ml-5 font-mono text-[10px] text-mist">YOUR BUSINESS, ONLINE</span>
        </div>
        <div className="p-6 sm:p-9">
          <div className="flex items-center justify-between"><span className="h-2.5 w-20 rounded-full bg-paper" /><span className="h-2 w-14 rounded-full bg-paper/20" /></div>
          <div className="mt-10 inline-flex rounded-full border border-line px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-mist">Made for what’s next</div>
          <p className="font-display mt-4 max-w-[10ch] text-4xl font-semibold leading-tight sm:text-5xl">Big ideas.<br />Real presence.</p>
          <div className="mt-5 space-y-2"><div className="h-1.5 w-4/5 rounded bg-paper/20" /><div className="h-1.5 w-3/5 rounded bg-paper/15" /></div>
          <div className="mt-7 inline-flex items-center gap-8 rounded-full bg-paper px-5 py-3 text-xs font-medium text-obsidian">Let’s get started <ArrowUpRight className="h-4 w-4" /></div>
          <div className="mt-9 grid grid-cols-3 gap-3">{["Thoughtful design", "Built for mobile", "Ready to grow"].map((item, i) => <div key={item} className="rounded-xl border border-line bg-steel p-3"><span className="font-mono text-[10px] text-ash">0{i+1}</span><p className="mt-4 text-[10px] leading-relaxed text-mist">{item}</p></div>)}</div>
        </div>
      </div>
      <div className="absolute -bottom-1 right-0 flex items-center gap-3 rounded-2xl border border-paper/20 bg-steel px-5 py-4 shadow-xl sm:-right-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-obsidian"><Check className="h-4 w-4" /></span>
        <div><p className="text-sm font-medium">Built. Launched. Supported.</p><p className="mt-1 text-xs text-mist">Your next chapter starts here.</p></div>
      </div>
      <MousePointer2 className="absolute right-12 top-1 h-7 w-7 fill-paper text-paper" />
    </div>
  );
}
