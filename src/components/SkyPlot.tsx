"use client";
import Plot from 'react-plotly.js';
import { useMemo } from 'react';
import { type Data, type Layout } from 'plotly.js';

// Define the structure of the data we expect from our backend API
interface AnalysisResult {
  MJD: number;
  RA_deg: number;
  Dec_deg: number;
  Unc_deg: number;
  log10_Ereco: number;
  anomaly_score: number;
}

interface SkyPlotProps {
  results: AnalysisResult[];
}

const SkyPlot = ({ results }: SkyPlotProps) => {
  // useMemo will re-calculate the plot data only when the results change
  const plotData = useMemo((): Data[] => {
    if (!results || results.length === 0) return [];

    const r = 10;
    const x = results.map(d => r * Math.cos(d.RA_deg * Math.PI / 180) * Math.cos(d.Dec_deg * Math.PI / 180));
    const y = results.map(d => r * Math.sin(d.RA_deg * Math.PI / 180) * Math.cos(d.Dec_deg * Math.PI / 180));
    const z = results.map(d => r * Math.sin(d.Dec_deg * Math.PI / 180));

    return [{
      x: x,
      y: y,
      z: z,
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        color: results.map(d => d.anomaly_score),
        size: results.map(d => d.log10_Ereco),
        sizemin: 4,
        sizeref: 0.1,
        colorscale: 'Plasma',
        showscale: true,
        colorbar: {
          title: {
            text: 'Anomaly Score',
            font: { color: 'white' }
          },
          tickfont: { color: 'white' }
        }
      },
      hoverinfo: 'text',
      text: results.map(d =>
        `<b>Anomaly Score:</b> ${d.anomaly_score.toFixed(4)}<br>` +
        `<b>log10(Energy):</b> ${d.log10_Ereco.toFixed(2)}<br>` +
        `<b>RA:</b> ${d.RA_deg.toFixed(2)}°<br>` +
        `<b>Dec:</b> ${d.Dec_deg.toFixed(2)}°`
      ),
    }];
  }, [results]);

  // Define the layout with the explicit Partial<Layout> type
  const layout: Partial<Layout> = useMemo(() => ({
    title: { text: 'Interactive Sky Map of Neutrino Events' }, // FIX: 'title' is an object
    margin: { l: 0, r: 0, b: 0, t: 40 },
    scene: {
      xaxis: { visible: false },
      yaxis: { visible: false },
      zaxis: { visible: false },
      bgcolor: '#111827', // bg-gray-900
    },
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

export default SkyPlot;
