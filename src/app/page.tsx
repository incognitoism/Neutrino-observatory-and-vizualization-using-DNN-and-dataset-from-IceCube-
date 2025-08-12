"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, FileText, AlertTriangle, BarChart, ScatterChart, Globe } from "lucide-react";
import dynamic from 'next/dynamic';

// Define the structure of the data we expect from our backend API
interface AnalysisResult {
  MJD: number;
  RA_deg: number;
  Dec_deg: number;
  Unc_deg: number;
  log10_Ereco: number;
  anomaly_score: number;
}

// An improved, shimmering skeleton loader component
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`w-full h-full bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 rounded-xl animate-pulse ${className}`} />
);

// --- FIX: Dynamically import Plotly components with SSR turned off ---
const DynamicSkyPlot = dynamic(() => import('@/components/SkyPlot'), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});
const DynamicScoreVsEnergyPlot = dynamic(() => import('@/components/ScoreVsEnergyPlot'), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});
const DynamicDistributionPlot = dynamic(() => import('@/components/DistributionPlot'), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null); // Clear previous errors on new file selection
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use the public URL for your deployed backend
      const API_URL = "https://cosmic-anomaly-observatory.onrender.com/analyze/"; 
      
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "An error occurred during analysis.");
      }

      const data: AnalysisResult[] = await response.json();
      setResults(data);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center mt-4">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
          Anomaly Detection Dashboard
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto text-lg">
          An AI-powered observatory to discover anomalous events in astrophysical neutrino data.
        </p>
      </div>

      {/* File Upload */}
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-white">
            <UploadCloud size={24} className="text-blue-400" /> Upload Data File
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select a `.txt` file containing neutrino event data to begin the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label
              htmlFor="file-upload"
              className="flex-grow cursor-pointer bg-gray-800/50 hover:bg-gray-700/70 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center text-gray-400 transition-all hover:scale-[1.02] hover:border-blue-500"
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} className="text-gray-300" />
                <span>{file ? file.name : "Click or drag to upload a file"}</span>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".txt"
            />
            <Button
              onClick={handleAnalyzeClick}
              disabled={isLoading || !file}
              className="w-48 h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-all rounded-xl shadow-lg"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
          {error && (
            <div className="mt-4 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 animate-shake">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {(isLoading || results.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Sky Plot */}
          <Card className="xl:col-span-3 bg-gray-900/80 border border-gray-700 shadow-lg rounded-2xl overflow-hidden backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe size={20} className="text-green-400" /> 3D Sky Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-[520px]">
              {isLoading ? <SkeletonLoader /> : <DynamicSkyPlot results={results} />}
            </CardContent>
          </Card>

          {/* Side Plots */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg rounded-2xl overflow-hidden backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ScatterChart size={20} className="text-yellow-400" /> Score vs. Energy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 h-[220px]">
                {isLoading ? <SkeletonLoader /> : <DynamicScoreVsEnergyPlot results={results} />}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg rounded-2xl overflow-hidden backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart size={20} className="text-pink-400" /> Energy Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 h-[220px]">
                {isLoading ? <SkeletonLoader /> : <DynamicDistributionPlot results={results} />}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
