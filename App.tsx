import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Stats } from '@react-three/drei';
import AizawaAttractor from './components/AizawaAttractor';
import Controls from './components/Controls';
import ExplanationModal from './components/ExplanationModal';
import { AizawaParams, VisualizationSettings, DEFAULT_PARAMS, DEFAULT_SETTINGS } from './types';
import { getAttractorExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [params, setParams] = useState<AizawaParams>(DEFAULT_PARAMS);
  const [settings, setSettings] = useState<VisualizationSettings>(DEFAULT_SETTINGS);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleExplain = async () => {
    setIsAiLoading(true);
    setExplanation(null); // Clear previous
    
    // Simulate slight delay for UX if API is instant, mostly to show the loader state
    // but primarily fetch data.
    try {
      const text = await getAttractorExplanation(params);
      setExplanation(text);
    } catch (e) {
      setExplanation("Could not retrieve explanation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <color attach="background" args={['#000000']} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* The Attractor */}
        <Suspense fallback={null}>
            <AizawaAttractor params={params} settings={settings} />
        </Suspense>

        {/* Controls */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          rotateSpeed={0.5} 
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Performance stats (optional, good for dev, keeping small) */}
        {/* <Stats className="!left-auto !right-0 !top-auto !bottom-0" /> */}
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter filter drop-shadow-lg">
          Aizawa Attractor
        </h1>
        <p className="text-white/50 text-xs mt-1 font-mono tracking-wide">
          dx/dt = (z-b)x - dy<br/>
          dy/dt = dx + (z-b)y<br/>
          dz/dt = c + az - z³/3 - (x²+y²)(1+ez) + fzx³
        </p>
      </div>

      <Controls 
        params={params} 
        setParams={setParams} 
        settings={settings}
        setSettings={setSettings}
        onReset={handleReset}
        onExplain={handleExplain}
      />

      <ExplanationModal 
        explanation={explanation} 
        isLoading={isAiLoading} 
        onClose={() => {
            setExplanation(null);
            setIsAiLoading(false);
        }} 
      />
    </div>
  );
};

export default App;
