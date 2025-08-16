import { Trees, Waves, Droplets } from 'lucide-react';

const BIOMES = [
  { key: 'Forest', icon: Trees },
  { key: 'Coastal', icon: Waves },
  { key: 'River', icon: Droplets },
];

export default function BiomeSwitch({ value, onChange }){
  const current = BIOMES.find(b=>b.key===value) || BIOMES[0];
  const idx = BIOMES.indexOf(current);
  const next = () => onChange(BIOMES[(idx+1)%BIOMES.length].key);
  const Icon = current.icon;
  return (
    <button className="btn" onClick={next} aria-label={`Biome: ${current.key}`} title={`Biome: ${current.key}`} style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
      <Icon size={16} /> {current.key}
    </button>
  );
}

