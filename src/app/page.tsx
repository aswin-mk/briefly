'use client';

import { useEffect, useState } from 'react';
import { Link2, FileText, AlignLeft, Sparkles, Copy, Download } from 'lucide-react';

import { useCompletion } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('text');

  const [inputContent, setInputContent] = useState('');
  const [format, setFormat] = useState('Bullet Points');

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/summarize',
    streamProtocol: "text"
  });

  const handleGenerate = async () => {
    // If the user hasn't typed anything in the text tab, don't do anything
    if (activeTab === 'text' && !inputContent) return;


    // Trigger the AI request
    await complete(inputContent, {
      body: { format }
    });
  };

  const handleCopy = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    alert('Copied to clipboard!'); // You can replace this with a fancy toast notification later
  };

  const handleDownload = () => {
    if (!completion) return;
    const blob = new Blob([completion], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'briefly-summary.md';
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">

      {/* LEFT COLUMN: Input Section */}
      <section className="glass-panel p-6 flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative glowing orb in the background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">What are we summarizing?</h1>

        {/* Input Type Tabs */}
        <div className="flex gap-2 p-1 glass-input rounded-2xl w-full">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'url' ? 'bg-white/40 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Link2 size={16} /> URL
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'file' ? 'bg-white/40 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <FileText size={16} /> Upload
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'text' ? 'bg-white/40 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <AlignLeft size={16} /> Text
          </button>
        </div>

        {/* Dynamic Input Area (Changes based on active tab) */}
        <div className="flex-1 flex flex-col min-h-[200px]">
          {activeTab === 'text' && (
            <textarea
              className="w-full h-full glass-input p-4 resize-none"
              placeholder="Paste your article, notes, or transcript here..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
          )}
          {activeTab === 'url' && (
            <input
              type="url"
              className="w-full glass-input p-4"
              placeholder="https://example.com/article"
            />
          )}
          {activeTab === 'file' && (
            <div className="w-full h-full glass-input border-dashed border-2 flex flex-col items-center justify-center text-slate-500 gap-3 cursor-pointer hover:bg-white/10 transition-colors">
              <FileText size={32} className="opacity-50" />
              <p className="text-sm">Tap or drag to upload PDF / TXT</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex gap-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="glass-input px-4 py-3 text-sm appearance-none cursor-pointer flex-1"
          >
            <option>TL;DR</option>
            <option>Bullet Points</option>
            <option>Executive Brief</option>
            <option>Explain Like I'm 5</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isLoading || (activeTab === 'text' && !inputContent)}
            className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 backdrop-blur-md transition-all disabled:opacity-50"
          >
            {isLoading ? <span className="animate-pulse">Analyzing...</span> : <><Sparkles size={18} /> Generate</>}
          </button>
        </div>
      </section>

      {/* RIGHT COLUMN: Output Section */}
      <section className="glass-panel p-6 flex flex-col relative h-[50vh] md:h-auto">

        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-slate-800">Result</h2>
          {completion && (
            <div className="flex gap-2">
              <button className="p-2 glass-input hover:bg-white/20 rounded-lg text-slate-600 transition-colors" onClick={handleCopy} title="Copy to clipboard">
                <Copy size={16} />
              </button>
              <button className="p-2 glass-input hover:bg-white/20 rounded-lg text-slate-600 transition-colors" onClick={handleDownload} title="Download .md">
                <Download size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Display area for the streaming AI summary */}
        <div className="flex-1 overflow-y-auto">
          {/*Error Display Box */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <p className="font-bold">Something went wrong:</p>
              <p>{error.message}</p>
            </div>
          )}

          {!completion && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <Sparkles size={48} className="mb-4" />
              <p>Your summary will appear here.</p>
            </div>
          ) : (
            <div className="prose prose-slate prose-p:leading-relaxed whitespace-pre-wrap text-slate-800">
              <ReactMarkdown>{completion}</ReactMarkdown>

            </div>
          )}
        </div>

      </section>

    </div>
  );
}