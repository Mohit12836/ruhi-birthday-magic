import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';
import { bdayAudio } from '../../audio/birthdayAudio';

export const AttitudeScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const startScan = () => {
    if (scanning || scanned) return;
    setScanning(true);
    bdayAudio.playChime(600);

    setTimeout(() => bdayAudio.playChime(750), 600);
    setTimeout(() => bdayAudio.playChime(900), 1200);

    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      bdayAudio.playChime(1046.5);
    }, 2000);
  };

  const metrics = [
    { label: 'शाही स्टाइल & ग्लैमर (Style)', value: '100%' },
    { label: 'बॉस लेडी कॉन्फिडेंस (Boss Level)', value: '100%' },
    { label: 'मासूमियत + नटखटपन (Cuteness)', value: '500%' },
    { label: 'तेरे भाई मोहित पर पूरा हक & प्यार (Bond)', value: '1000% (Infinity)' },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-4 w-full">
      {/* Scanner Radar / Display */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-cyan-400/40 bg-slate-950/80 flex flex-col items-center justify-center p-4 shadow-[0_0_40px_rgba(6,182,212,0.3)] overflow-hidden my-3">
        {/* Animated Scanner Radar Line */}
        {scanning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 origin-center bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent pointer-events-none"
          />
        )}

        {/* Central Display */}
        {!scanned ? (
          <div className="flex flex-col items-center text-center z-10">
            <Activity
              className={`w-10 h-10 ${
                scanning ? 'text-cyan-400 animate-spin' : 'text-cyan-300/70'
              } mb-2`}
            />
            <span className="text-xs font-mono text-cyan-200 uppercase tracking-widest">
              {scanning ? 'SCANNING ENERGY...' : 'AURA SCANNER READY'}
            </span>
            <span className="text-[10px] text-cyan-300/60 mt-1">
              {scanning ? 'विश्लेषण जारी है...' : 'स्कैन शुरू करने के लिए बटन दबाएं'}
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center z-10"
          >
            <Zap className="w-10 h-10 text-amber-300 animate-bounce mb-1" />
            <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
              1000%
            </span>
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              💥 OVERFLOW LEVEL!
            </span>
            <span className="text-[10px] text-slate-300 mt-1">
              Unstoppable Sister
            </span>
          </motion.div>
        )}
      </div>

      {/* Button / Metrics */}
      {!scanned ? (
        <button
          onClick={startScan}
          disabled={scanning}
          className="mt-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer disabled:opacity-50"
        >
          {scanning ? 'ऑरा स्कैन हो रहा है...' : '⚡ रूही का पावर लेवल स्कैन करें'}
        </button>
      ) : (
        <div className="w-full space-y-2 mt-2">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-xs sm:text-sm"
            >
              <span className="text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {m.label}
              </span>
              <span className="font-mono font-bold text-cyan-300">{m.value}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
