"use client";
import Plot from 'react-plotly.js';
import { useMemo } from 'react';
import { type Data, type Layout } from 'plotly.js';

interface AnalysisResult {
  log10_Ereco: number;
  anomaly_score: number;
}

interface ScoreVsEnergyPlotProps {
  results: AnalysisResult[];
}

const ScoreVsEnergyPlot = ({ results }: ScoreVsEnergyPlotProps) => {
  const plotData = useMemo((): Data[] => {
    if (!results || results.length === 0) return [];

    return [{
      x: results.map(d => d.log10_Ereco),
      y: results.map(d => d.anomaly_score),
      mode: 'markers',
      type: 'scatter',
      marker: {
        color: results.map(d => d.anomaly_score),
        colorscale: 'Plasma',
        showscale: false,
        opacity: 0.7,
      },
    }];
  }, [results]);

  const layout: Partial<Layout> = useMemo(() => ({
    xaxis: { 
      title: { text: 'log10(Energy)', font: { color: '#9CA3AF' } }, 
      color: '#9CA3AF', 
      gridcolor: '#374151' 
    },
    yaxis: { 
      title: { text: 'Anomaly Score', font: { color: '#9CA3AF' } }, 
      color: '#9CA3AF', 
      gridcolor: '#374151' 
    },
    margin: { l: 50, r: 20, b: 40, t: 10 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
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

export default ScoreVsEnergyPlot;
