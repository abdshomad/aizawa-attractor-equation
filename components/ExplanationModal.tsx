import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface Props {
  explanation: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const ExplanationModal: React.FC<Props> = ({ explanation, isLoading, onClose }) => {
  if (!explanation && !isLoading) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-600/30 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-yellow-400 w-5 h-5" />
              Gemini Insight
            </h3>
            <button 
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-white/80 leading-relaxed text-sm min-h-[100px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-white/50 animate-pulse">Analyzing attractor geometry...</span>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <p>{explanation}</p>
              </div>
            )}
          </div>

          {!isLoading && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
