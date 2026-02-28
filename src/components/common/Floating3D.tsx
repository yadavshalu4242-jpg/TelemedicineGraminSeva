export default function Floating3D() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 select-none overflow-hidden"
    >
      {/* Left floating circle - large */}
      <img
        src="/images/floating-1.svg"
        alt="decoration"
        className="absolute -left-20 top-20 w-64 opacity-50 hero-3d float-slow"
      />

      {/* Right bottom rounded rect */}
      <img
        src="/images/floating-2.svg"
        alt="decoration"
        className="absolute right-16 bottom-24 w-64 opacity-40 hero-3d spin-slow"
      />

      {/* Right top circle */}
      <img
        src="/images/floating-1.svg"
        alt="decoration"
        className="absolute right-40 top-32 w-40 opacity-45 hero-3d float-medium"
      />

      {/* Additional decorative elements - left side */}
      <div className="absolute left-8 top-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl float-fast" />
      
      {/* Additional decorative elements - right side */}
      <div className="absolute right-1/4 top-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-3xl float-slow" />
      
      {/* Bottom decorative element */}
      <div className="absolute left-1/3 bottom-20 w-48 h-48 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 blur-3xl float-medium" />
      
      {/* Top center glow */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-56 h-56 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl pulse-soft" />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
}
