"use client";
import Plot from 'react-plotly.js';
import { useMemo } from 'react';
import { type Data, type Layout } from 'plotly.js';

interface AnalysisResult {
  log10_Ereco: number;
  anomaly_score: number;
}

interface DistributionPlotProps {
  results: AnalysisResult[];
}

const DistributionPlot = ({ results }: DistributionPlotProps) => {
  const plotData = useMemo((): Data[] => {
    if (!results || results.length === 0) return [];

    // Separate normal events from top anomalies (e.g., top 5%)
    // First, sort by anomaly score to find the threshold
    const sortedResults = [...results].sort((a, b) => b.anomaly_score - a.anomaly_score);
    const anomalyThreshold = sortedResults[Math.floor(results.length * 0.05)].anomaly_score;
    
    const normalEvents = results.filter(d => d.anomaly_score < anomalyThreshold);
    const anomalousEvents = results.filter(d => d.anomaly_score >= anomalyThreshold);

    return [
      {
        x: normalEvents.map(d => d.log10_Ereco),
        type: 'histogram',
        name: 'Normal Events',
        opacity: 0.6,
        marker: { color: '#3B82F6' }, // Blue-500
      },
      {
        x: anomalousEvents.map(d => d.log10_Ereco),
        type: 'histogram',
        name: 'Top 5% Anomalies',
        opacity: 0.85,
        marker: { color: '#FBBF24' }, // Amber-400
      }
    ];
  }, [results]);

  const layout: Partial<Layout> = useMemo(() => ({
    xaxis: { 
      title: { text: 'log10(Energy)', font: { color: '#9CA3AF' } }, 
      color: '#9CA3AF', 
      gridcolor: '#374151' 
    },
    yaxis: { 
      title: { text: 'Count', font: { color: '#9CA3AF' } }, 
      color: '#9CA3AF', 
      gridcolor: '#374151' 
    },
    barmode: 'overlay',
    margin: { l: 50, r: 20, b: 40, t: 10 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
    legend: { font: { color: 'white' }, x: 0.05, y: 0.95 },
    autosize: true,
  }), []);

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  );
};

export default DistributionPlot;
