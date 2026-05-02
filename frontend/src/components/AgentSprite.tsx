// CSS pixel art sprites using grid of divs
// Each sprite is a 16x16 grid of "pixels"
// Colors: gold, violet, teal, white on dark background

type SpriteName = 'odyclaw' | 'perseus' | 'apollo' | 'athena' | 'helena';

interface AgentSpriteProps {
  name: SpriteName;
  status?: 'active' | 'idle' | 'offline';
  size?: number;
}

// OdyClaw — command motif: laurel/shield silhouette in gold
const odyclawPixels = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Perseus — sword silhouette in silver/white
const perseusPixels = [
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Apollo — sun rays in gold
const apolloPixels = [
  [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0],
  [0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0],
  [1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,1],
  [0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0],
  [0,1,1,1,0,0,1,1,1,0,0,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Athena — owl silhouette in violet
const athenaPixels = [
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,0,0,1,1,1,0,0,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0],
  [0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0],
  [0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Helena — flame in orange/gold
const helenaPixels = [
  [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const spriteData: Record<SpriteName, { pixels: number[][]; color: string }> = {
  odyclaw: { pixels: odyclawPixels, color: '#c9a84c' },
  perseus: { pixels: perseusPixels, color: '#e8e8f0' },
  apollo: { pixels: apolloPixels, color: '#c9a84c' },
  athena: { pixels: athenaPixels, color: '#7c5cbf' },
  helena: { pixels: helenaPixels, color: '#e8753e' },
};

export function AgentSprite({ name, status = 'active', size = 16 }: AgentSpriteProps) {
  const { pixels, color } = spriteData[name] ?? spriteData.odyclaw;
  const pixelSize = Math.floor(size / 16);

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* Sprite grid */}
      <div
        className="grid"
        style={{
          width: size,
          height: size,
          gridTemplateColumns: `repeat(16, ${pixelSize}px)`,
          gridTemplateRows: `repeat(16, ${pixelSize}px)`,
        }}
      >
        {pixels.flat().map((on, i) => (
          <div
            key={i}
            style={{
              width: pixelSize,
              height: pixelSize,
              background: on ? color : 'transparent',
              opacity: status === 'offline' ? 0.3 : status === 'idle' ? 0.6 : 1,
            }}
          />
        ))}
      </div>
      {/* Status indicator */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot"
        style={{
          background: status === 'active' ? '#3ecf8e' : status === 'idle' ? '#c9a84c' : '#6b6b80',
        }}
      />
    </div>
  );
}

// Text label + sprite combo
export function AgentCard({ name, sprite, role, status }: {
  name: string;
  sprite: SpriteName;
  role: string;
  status: 'active' | 'idle' | 'offline';
}) {
  return (
    <div className="card card-accent-gold p-4 flex items-center gap-4">
      <AgentSprite name={sprite} status={status} size={48} />
      <div>
        <div className="font-semibold text-sm" style={{ color: '#e8e8f0' }}>{name}</div>
        <div className="text-xs" style={{ color: '#6b6b80' }}>{role}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: status === 'active' ? '#3ecf8e' : status === 'idle' ? '#c9a84c' : '#6b6b80' }}
          />
          <span className="text-xs capitalize" style={{ color: '#6b6b80' }}>{status}</span>
        </div>
      </div>
    </div>
  );
}