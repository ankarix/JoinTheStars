
import React, { useState, useEffect } from 'react';
import { CameraScanner } from './components/CameraScanner';
import { ZODIAC_SIGNS } from './constants';
import { Step, ReadingResult, ZodiacSign } from './types';
import { analyzeDestiny } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('Consulting the stars...');

  const messages = [
    "Aligning planetary energies...",
    "Interpreting facial contours...",
    "Reading the lines of your life...",
    "Decoding the cosmic web...",
    "Finalizing your destiny report..."
  ];

  useEffect(() => {
    if (step === 'analyzing') {
      let msgIndex = 0;
      const interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setLoadingMsg(messages[msgIndex]);
      }, 2500);

      const runAnalysis = async () => {
        if (selectedZodiac && faceImage && palmImage) {
          try {
            const data = await analyzeDestiny(selectedZodiac.name, faceImage, palmImage);
            setResult(data);
            setStep('result');
          } catch (error) {
            console.error(error);
            setStep('zodiac'); // Fallback
            alert("The stars are clouded right now. Please try again.");
          }
        }
      };

      runAnalysis();
      return () => clearInterval(interval);
    }
  }, [step, selectedZodiac, faceImage, palmImage]);

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="flex flex-col items-center text-center space-y-8 animate-fadeIn py-12 px-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full"></div>
              <h1 className="text-5xl md:text-7xl font-mystical font-bold bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 to-yellow-600 relative">
                Celestial Oracle
              </h1>
            </div>
            <p className="max-w-md text-lg text-purple-200/80 font-light leading-relaxed">
              Unlock the secrets of your future. Combine ancient astrology with modern AI vision to reveal your true destiny.
            </p>
            <button
              onClick={() => setStep('zodiac')}
              className="mt-8 px-12 py-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 bg-size-200 rounded-full font-mystical text-xl text-yellow-100 shadow-[0_0_30px_rgba(126,34,206,0.5)] hover:shadow-[0_0_50px_rgba(126,34,206,0.8)] transition-all hover:-translate-y-1"
            >
              Begin Your Journey
            </button>
          </div>
        );

      case 'zodiac':
        return (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
            <h2 className="text-3xl font-mystical text-center text-yellow-400 mb-8">Choose Your Zodiac Sign</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => {
                    setSelectedZodiac(sign);
                    setStep('face-scan');
                  }}
                  className="glass-card p-6 rounded-2xl flex flex-col items-center group hover:border-yellow-500/50 hover:bg-white/5 transition-all"
                >
                  <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">{sign.icon}</span>
                  <span className="font-bold text-white">{sign.name}</span>
                  <span className="text-xs text-purple-400">{sign.dateRange}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'face-scan':
        return (
          <CameraScanner 
            title="Scan Your Face" 
            overlayType="face" 
            onCapture={(img) => {
              setFaceImage(img);
              setStep('palm-scan');
            }} 
          />
        );

      case 'palm-scan':
        return (
          <CameraScanner 
            title="Scan Your Palm" 
            overlayType="palm" 
            onCapture={(img) => {
              setPalmImage(img);
              setStep('analyzing');
            }} 
          />
        );

      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-purple-500/20 border-t-yellow-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="text-2xl font-mystical text-yellow-100 animate-pulse">{loadingMsg}</p>
          </div>
        );

      case 'result':
        if (!result) return null;
        return (
          <div className="w-full max-w-3xl mx-auto px-4 py-12 animate-fadeIn space-y-12 pb-24">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-mystical text-yellow-500">Your Cosmic Reading</h2>
              <div className="flex justify-center items-center space-x-4">
                <span className="px-4 py-1 bg-purple-900/40 rounded-full text-xs font-bold text-purple-200 border border-purple-500/30">
                  {selectedZodiac?.name}
                </span>
                <span className="px-4 py-1 bg-purple-900/40 rounded-full text-xs font-bold text-purple-200 border border-purple-500/30">
                  Spirit Animal: {result.spiritAnimal}
                </span>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="glass-card p-8 rounded-3xl pulse-gold">
                <h3 className="text-xl font-mystical text-yellow-400 mb-4 flex items-center">
                  <span className="mr-3 text-2xl">🔮</span> Daily Horoscope
                </h3>
                <p className="text-lg text-purple-100 leading-relaxed font-light italic">"{result.horoscope}"</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl border-purple-500/10">
                  <h4 className="font-mystical text-indigo-300 mb-3 flex items-center">
                    <span className="mr-2">👤</span> Face Reading
                  </h4>
                  <p className="text-sm text-purple-100/90 leading-relaxed">{result.faceAnalysis}</p>
                </div>
                <div className="glass-card p-6 rounded-3xl border-purple-500/10">
                  <h4 className="font-mystical text-indigo-300 mb-3 flex items-center">
                    <span className="mr-2">✋</span> Palmistry
                  </h4>
                  <p className="text-sm text-purple-100/90 leading-relaxed">{result.palmAnalysis}</p>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border-yellow-500/20">
                <h3 className="text-xl font-mystical text-yellow-400 mb-4">The Next 6 Months</h3>
                <p className="text-purple-100 leading-relaxed">{result.futurePrediction}</p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <div className="flex space-x-6">
                  {result.luckyNumbers.map(n => (
                    <div key={n} className="w-16 h-16 rounded-full glass-card border-yellow-500/40 flex items-center justify-center text-2xl font-bold text-yellow-400 shadow-lg">
                      {n}
                    </div>
                  ))}
                </div>
                <p className="text-xs uppercase tracking-widest text-purple-400 font-bold">Your Lucky Numbers</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep('intro')}
                className="px-8 py-3 bg-white/5 border border-white/20 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                Start New Reading
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-mystical font-bold text-yellow-400 cursor-pointer" onClick={() => setStep('intro')}>
          ORACLE
        </div>
        <div className="flex space-x-4">
          <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-sm cursor-help opacity-50 hover:opacity-100 transition-opacity">
            ?
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 flex-grow">
        {renderStep()}
      </main>

      {/* Background Particles Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 5 + 's'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
