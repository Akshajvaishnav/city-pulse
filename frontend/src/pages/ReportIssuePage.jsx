import React, { useState, useRef, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import { api } from '../services/api';
import LocationPickerMap from '../components/LocationPickerMap';
import DefectIcon from '../components/DefectIcon';
import SeverityBadge from '../components/SeverityBadge';
import {
  UploadCloud,
  Camera,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Send,
  Loader2,
  Image as ImageIcon,
  Check,
  RefreshCw
} from 'lucide-react';

export default function ReportIssuePage({ setActiveTab, prefilledData = null }) {
  const { refreshAll, addToast } = useIssues();
  const fileInputRef = useRef(null);

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(prefilledData?.image_url || null);
  const [annotatedPreview, setAnnotatedPreview] = useState(prefilledData?.annotated_image_url || null);
  const [defectType, setDefectType] = useState(prefilledData?.defect_type || 'Pothole');
  const [severity, setSeverity] = useState(prefilledData?.severity || 'High');
  const [confidence, setConfidence] = useState(prefilledData?.confidence || 0.92);
  const [locationName, setLocationName] = useState(prefilledData?.location_name || 'Sector 62, Noida');
  const [latitude, setLatitude] = useState(prefilledData?.latitude || 28.6280);
  const [longitude, setLongitude] = useState(prefilledData?.longitude || 77.3649);
  const [description, setDescription] = useState(prefilledData?.description || '');
  const [reportedBy, setReportedBy] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [boundingBoxes, setBoundingBoxes] = useState(prefilledData?.bounding_boxes || []);

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiScanDone, setAiScanDone] = useState(!!prefilledData);

  const defectOptions = [
    'Pothole',
    'Road Damage',
    'Broken Street Light',
    'Garbage Overflow',
    'Water Leakage',
    'Damaged Sign'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAiScanDone(false);
      // Auto trigger AI Scan on upload
      runAiScan(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAiScanDone(false);
      runAiScan(file);
    }
  };

  const runAiScan = async (fileToScan) => {
    const file = fileToScan || imageFile;
    if (!file) {
      addToast('Please upload an image first to run AI scan', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await api.detect(formData);
      setDefectType(result.defect_type);
      setSeverity(result.severity);
      setConfidence(result.confidence);
      setBoundingBoxes(result.bounding_boxes);
      if (result.annotated_image_url) {
        setAnnotatedPreview(result.annotated_image_url);
      }
      if (result.suggested_description && !description) {
        setDescription(result.suggested_description);
      }
      setAiScanDone(true);
      addToast(`AI Scan: Detected ${result.defect_type} (${Math.round(result.confidence * 100)}% confidence)`, 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'AI detection failed, you can still fill details manually', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagePreview && !imageFile) {
      addToast('Please upload an infrastructure defect photograph.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = imagePreview;
      let finalAnnotatedUrl = annotatedPreview;

      // If a file was selected but not uploaded through detect
      if (imageFile && (!finalImageUrl || finalImageUrl.startsWith('blob:'))) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.detect(formData);
        finalImageUrl = uploadRes.image_url;
        finalAnnotatedUrl = uploadRes.annotated_image_url;
      }

      const payload = {
        defect_type: defectType,
        image_url: finalImageUrl || '/uploads/pothole_sector62.jpg',
        annotated_image_url: finalAnnotatedUrl,
        description: description || `Infrastructure defect reported: ${defectType} at ${locationName}`,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location_name: locationName,
        severity: severity,
        confidence: confidence,
        reported_by: reportedBy || 'Citizen Reporter',
        reporter_contact: reporterContact || null,
        ai_detected: true,
        bounding_boxes_json: JSON.stringify(boundingBoxes),
      };

      const created = await api.createIssue(payload);
      addToast(`Success! Created report ${created.report_id}`, 'success');
      refreshAll();
      // Redirect to dashboard to view newly added issue
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 pb-2 border-b border-slate-800">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          Citizen & Inspector Portal
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Report Infrastructure Problem
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload a photograph of road cracks, potholes, broken lights, or overflow. Our AI engine will inspect the flaw, calculate severity, and log an official municipal ticket.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Image Upload & AI Pre-Scan */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>1. Upload Defect Photograph</span>
            </h3>
            {analyzing && (
              <span className="text-xs text-cyan-400 flex items-center gap-1.5 font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Analyzing image...</span>
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 transition group relative overflow-hidden"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="space-y-3">
                <div className="h-64 max-w-lg mx-auto rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
                  <img
                    src={annotatedPreview || imagePreview}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                  />
                  {aiScanDone && (
                    <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AI Scan Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">Click or drag a new image to replace</p>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Click or drag & drop photo here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP (Max 15MB)</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Detection Summary Banner if analyzed */}
          {aiScanDone && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase">AI Defect Detection Output</p>
                  <p className="text-sm font-bold text-white">
                    {defectType} detected with {Math.round(confidence * 100)}% confidence
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={severity} />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Problem Classification & Severity */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DefectIcon type={defectType} className="w-4 h-4 text-amber-400" />
            <span>2. Defect Classification & Urgency</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Infrastructure Defect Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {defectOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDefectType(opt)}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                      defectType === opt
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 glow-cyan'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <DefectIcon type={opt} className="w-4 h-4 shrink-0" />
                    <span className="truncate">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['High', 'Medium', 'Low'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition text-center ${
                      severity === sev
                        ? sev === 'High'
                          ? 'bg-rose-500/20 border-rose-400 text-rose-200 glow-rose'
                          : sev === 'Medium'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 glow-amber'
                          : 'bg-emerald-500/20 border-emerald-400 text-emerald-200 glow-emerald'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                High severity automatically dispatches high-priority emergency notifications to municipal road crews.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Location Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>3. Incident Location & Map Pin</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Landmark / Sector / Area Name
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Sector 62, Noida Expressway Near Metro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="flex items-end">
              <div className="text-xs text-cyan-400 font-mono p-2 bg-cyan-950/20 rounded-xl border border-cyan-500/20 w-full text-center">
                Geotag: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
            </div>
          </div>

          <LocationPickerMap
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            onLocationNameChange={(name) => setLocationName(name)}
          />
        </div>

        {/* Step 4: Description & Reporter Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Additional Details & Contact
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Special Hazard Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe vehicle impact, depth of pothole, obstruction of traffic lane, or danger to pedestrians..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reporter Name (Optional)
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone / Email (For Status Updates)
              </label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="+91-9876543210 or email@domain.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl glow-cyan flex items-center gap-2.5 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Issue in Smart City Registry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Official Defect Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
