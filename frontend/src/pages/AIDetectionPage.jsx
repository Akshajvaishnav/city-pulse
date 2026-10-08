import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { useIssues } from '../context/IssueContext';
import SeverityBadge from '../components/SeverityBadge';
import DefectIcon from '../components/DefectIcon';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import {
  Camera,
  UploadCloud,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export default function AIDetectionPage({ setActiveTab, setPrefilledReportData }) {
  const { addToast } = useIssues();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState('/uploads/pothole_sector62.jpg');
  const [detectionResult, setDetectionResult] = useState({
    defect_type: 'Pothole',
    confidence: 0.94,
    severity: 'High',
    detected_flaws_count: 2,
    bounding_boxes: [
      { label: 'Pothole (Grade-A)', confidence: 0.94, box: [0.35, 0.25, 0.72, 0.75], color: '#EF4444' },
      { label: 'Surface Cavity', confidence: 0.88, box: [0.65, 0.68, 0.88, 0.92], color: '#EF4444' },
    ],
    image_url: '/uploads/pothole_sector62.jpg',
    annotated_image_url: '/uploads/annotated_pothole_sector62.jpg',
    suggested_description: 'Severe asphalt depression and pothole detected in road surface. Poses immediate vehicle damage and traffic hazard.',
    model_version: 'SmartCity-CV-v1.4-MockEngine',
    is_mock: true,
    analysis_details: {
      resolution: '800x600',
      detection_engine: 'Heuristic Object Localization Engine',
      inference_time_ms: 68,
      gpu_accelerated: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('annotated'); // 'annotated' | 'canvas' | 'raw'

  const demoPresets = [
    {
      name: 'Expressway Pothole',
      file: 'pothole_sector62.jpg',
      type: 'Pothole',
    },
    {
      name: 'Market Road Cracks',
      file: 'road_crack_sector18.jpg',
      type: 'Road Damage',
    },
    {
      name: 'Broken Street Light',
      file: 'street_light_sector15.jpg',
      type: 'Broken Street Light',
    },
    {
      name: 'Metro Garbage Spill',
      file: 'garbage_sector21.jpg',
      type: 'Garbage Overflow',
    },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setOriginalImageUrl(localUrl);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.detect(formData);
      setDetectionResult(res);
      addToast(`AI Detection Complete: ${res.defect_type} (${Math.round(res.confidence * 100)}%)`, 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Detection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (preset) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('sample_name', preset.file);
      const res = await api.detect(formData);
      setDetectionResult(res);
      setOriginalImageUrl(res.image_url);
      addToast(`Loaded preset: ${preset.name}`, 'info');
    } catch (err) {
      console.error(err);
      addToast('Failed to load sample image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToReport = () => {
    if (detectionResult) {
      setPrefilledReportData({
        defect_type: detectionResult.defect_type,
        severity: detectionResult.severity,
        confidence: detectionResult.confidence,
        description: detectionResult.suggested_description,
        image_url: detectionResult.image_url,
        annotated_image_url: detectionResult.annotated_image_url,
        bounding_boxes: detectionResult.bounding_boxes,
        location_name: 'Sector 62, Delhi NCR',
        latitude: 28.6280,
        longitude: 77.3649,
      });
      setActiveTab('report');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Computer Vision Defect Localizer</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Infrastructure Flaw Scanner
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg glow-cyan flex items-center gap-2 transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Preset Quick Try Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Quick Benchmark Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {demoPresets.map((preset) => (
            <button
              key={preset.file}
              onClick={() => handlePresetSelect(preset)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <DefectIcon type={preset.type} className="w-3.5 h-3.5" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Visual Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Side-by-side or tabbed Image Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Visual Defect Inspection</span>
            </h3>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveViewTab('annotated')}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  activeViewTab === 'annotated'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AI Annotated
              </button>
              <button
                onClick={() => setActiveViewTab('canvas')}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  activeViewTab === 'canvas'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive BBoxes
              </button>
              <button
                onClick={() => setActiveViewTab('raw')}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  activeViewTab === 'raw'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Original Photo
              </button>
            </div>
          </div>

          <div className="relative min-h-[380px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 p-12 text-slate-400">
                <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin glow-cyan" />
                <p className="text-sm font-bold text-cyan-300">Processing Neural Defect Localizer...</p>
              </div>
            ) : activeViewTab === 'canvas' ? (
              <BoundingBoxCanvas
                imageUrl={detectionResult?.image_url || originalImageUrl}
                boundingBoxes={detectionResult?.bounding_boxes || []}
              />
            ) : activeViewTab === 'annotated' && detectionResult?.annotated_image_url ? (
              <img
                src={detectionResult.annotated_image_url}
                alt="AI Annotated Defect"
                className="w-full h-full object-cover max-h-[480px]"
              />
            ) : (
              <img
                src={originalImageUrl}
                alt="Original Defect"
                className="w-full h-full object-cover max-h-[480px]"
              />
            )}

            {/* Floating Top Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>
                {activeViewTab === 'annotated'
                  ? 'HUD Overlay Mode'
                  : activeViewTab === 'canvas'
                  ? 'Dynamic SVG BBox Mode'
                  : 'Source Input Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Defect Breakdown & Action */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Defect Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <DefectIcon type={detectionResult?.defect_type} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">Classified Problem</p>
                  <h3 className="text-xl font-black text-white">{detectionResult?.defect_type}</h3>
                </div>
              </div>
              <SeverityBadge severity={detectionResult?.severity} />
            </div>

            {/* Confidence Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Confidence Score</span>
                <span className="font-mono font-black text-cyan-400 text-base">
                  {Math.round((detectionResult?.confidence || 0.9) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(detectionResult?.confidence || 0.9) * 100}%` }}
                />
              </div>
            </div>

            {/* Localized Flaw Count & Latency */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Detected Instances</p>
                <p className="text-xl font-bold text-amber-400 font-mono">
                  {detectionResult?.detected_flaws_count || 1} flaw(s)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Inference Latency</p>
                <p className="text-xl font-bold text-emerald-400 font-mono">
                  {detectionResult?.analysis_details?.inference_time_ms || 48} ms
                </p>
              </div>
            </div>

            {/* Description Suggestion */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-300 uppercase">AI Diagnosis Summary</p>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {detectionResult?.suggested_description || 'Infrastructure flaw localized successfully.'}
              </p>
            </div>

            {/* Convert to Report CTA */}
            <button
              onClick={handleExportToReport}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-xl glow-cyan flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Convert this Detection into Official City Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Architecture Transparency Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Cpu className="w-4 h-4" />
              <span>AI Engine Architecture</span>
            </div>
            <p className="leading-relaxed">
              Current Engine: <strong className="text-slate-200">{detectionResult?.model_version}</strong>.
              {detectionResult?.is_mock && (
                <span className="text-slate-400 block mt-1">
                  (Simulated Computer Vision Pipeline with real Pillow bounding box rendering. The backend includes a clean <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">YOLOv8DefectDetector</code> adapter ready for drop-in weights.)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
