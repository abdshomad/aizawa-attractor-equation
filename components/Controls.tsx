import React from 'react';
import { AizawaParams, VisualizationSettings } from '../types';
import { RefreshCcw, Info, Settings2, Sliders } from 'lucide-react';

interface ControlsProps {
  params: AizawaParams;
  setParams: React.Dispatch<React.SetStateAction<AizawaParams>>;
  settings: VisualizationSettings;
  setSettings: React.Dispatch<React.SetStateAction<VisualizationSettings>>;
  onReset: () => void;
  onExplain: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  params,
  setParams,
  settings,
  setSettings,
  onReset,
  onExplain,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'physics' | 'visual'>('physics');

  const handleParamChange = (key: keyof AizawaParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingChange = (key: keyof VisualizationSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-12'} bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white overflow-hidden shadow-2xl`}>
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        {isOpen && <h2 className="font-bold text-sm tracking-widest text-cyan-400 uppercase">Control Panel</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors ml-auto"
        >
          <Settings2 size={20} className="text-white/80" />
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Tabs */}
          <div className="flex space-x-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('physics')}
              className={`flex-1 flex items-center justify-center space-x-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'physics' ? 'bg-cyan-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders size={14} />
              <span>Physics</span>
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 flex items-center justify-center space-x-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'visual' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings2 size={14} />
              <span>Visuals</span>
            </button>
          </div>

          {activeTab === 'physics' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-3">
                <Slider label="Alpha (a)" value={params.a} min={0} max={1.5} step={0.01} onChange={(v) => handleParamChange('a', v)} color="cyan" />
                <Slider label="Beta (b)" value={params.b} min={0} max={1.5} step={0.01} onChange={(v) => handleParamChange('b', v)} color="cyan" />
                <Slider label="Gamma (c)" value={params.c} min={0} max={1.5} step={0.01} onChange={(v) => handleParamChange('c', v)} color="cyan" />
                <Slider label="Delta (d)" value={params.d} min={0} max={5.0} step={0.01} onChange={(v) => handleParamChange('d', v)} color="cyan" />
                <Slider label="Epsilon (e)" value={params.e} min={0} max={1.0} step={0.01} onChange={(v) => handleParamChange('e', v)} color="cyan" />
                <Slider label="Zeta (f)" value={params.f} min={0} max={0.5} step={0.001} onChange={(v) => handleParamChange('f', v)} color="cyan" />
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-3">
                <Slider label="Speed" value={settings.speed} min={0} max={3} step={0.1} onChange={(v) => handleSettingChange('speed', v)} color="purple" />
                <Slider label="Particles" value={settings.particleCount} min={1000} max={30000} step={1000} onChange={(v) => handleSettingChange('particleCount', v)} color="purple" />
                <Slider label="Point Size" value={settings.pointSize} min={0.01} max={0.5} step={0.01} onChange={(v) => handleSettingChange('pointSize', v)} color="purple" />
                <Slider label="Opacity" value={settings.opacity} min={0.1} max={1} step={0.05} onChange={(v) => handleSettingChange('opacity', v)} color="purple" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-semibold transition-colors border border-white/5"
            >
              <RefreshCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              onClick={onExplain}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-cyan-900/50"
            >
              <Info size={14} />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  color: 'cyan' | 'purple';
}> = ({ label, value, min, max, step, onChange, color }) => {
  const bgClass = color === 'cyan' ? 'accent-cyan-400' : 'accent-purple-400';
  
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex justify-between text-xs text-white/70">
        <label>{label}</label>
        <span className="font-mono text-white/90">{value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer ${bgClass}`}
      />
    </div>
  );
};

export default Controls;
