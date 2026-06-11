'use client';

interface TimezoneSelectorProps {
  useUTC: boolean;
  setUseUTC: (val: boolean) => void;
}

export default function TimezoneSelector({ useUTC, setUseUTC }: TimezoneSelectorProps) {
  return (
    <div className="inline-flex rounded-lg p-1 bg-slate-800/80 border border-slate-700/50 backdrop-blur-md">
      <button
        onClick={() => setUseUTC(false)}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
          !useUTC
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Giờ Việt Nam (GMT+7)
      </button>
      <button
        onClick={() => setUseUTC(true)}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
          useUTC
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Giờ Quốc Tế (UTC)
      </button>
    </div>
  );
}
