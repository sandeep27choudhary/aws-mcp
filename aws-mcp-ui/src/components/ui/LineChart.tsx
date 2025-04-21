import React, { useEffect, useRef } from 'react';
import { MetricDatapoint } from '../../types/aws';

interface LineChartProps {
  data: MetricDatapoint[];
  height?: number;
  width?: string;
  yAxisLabel?: string;
  title?: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  width = '100%',
  yAxisLabel,
  title,
  color = '#F59E0B'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Reset canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Set dimensions
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;
    
    // Find min and max values
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values) * 1.1; // Add 10% padding
    const minValue = Math.min(0, ...values);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#CBD5E1'; // Tailwind slate-300
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, chartHeight + padding.top);
    
    // X-axis
    ctx.moveTo(padding.left, chartHeight + padding.top);
    ctx.lineTo(chartWidth + padding.left, chartHeight + padding.top);
    ctx.stroke();
    
    // Draw grid lines & labels
    const yTickCount = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#64748B'; // Tailwind slate-500
    ctx.font = '10px system-ui';
    
    for (let i = 0; i <= yTickCount; i++) {
      const y = chartHeight * (1 - i / yTickCount) + padding.top;
      const value = minValue + (maxValue - minValue) * (i / yTickCount);
      
      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = '#E2E8F0'; // Tailwind slate-200
      ctx.moveTo(padding.left, y);
      ctx.lineTo(chartWidth + padding.left, y);
      ctx.stroke();
      
      // Label
      ctx.fillText(value.toFixed(1), padding.left - 5, y);
    }
    
    // X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const labelInterval = Math.max(1, Math.floor(data.length / 5));
    
    for (let i = 0; i < data.length; i += labelInterval) {
      const x = (i / (data.length - 1)) * chartWidth + padding.left;
      const date = new Date(data[i].timestamp);
      const label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      ctx.fillText(label, x, chartHeight + padding.top + 10);
    }
    
    // Draw Y-axis label if provided
    if (yAxisLabel) {
      ctx.save();
      ctx.translate(10, padding.top + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }
    
    // Draw line
    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      
      for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * chartWidth + padding.left;
        const y = chartHeight - ((data[i].value - minValue) / (maxValue - minValue)) * chartHeight + padding.top;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add gradient fill under the line
      const gradient = ctx.createLinearGradient(0, padding.top, 0, chartHeight + padding.top);
      gradient.addColorStop(0, `${color}33`); // 20% opacity
      gradient.addColorStop(1, `${color}05`); // 2% opacity
      
      ctx.lineTo(chartWidth + padding.left, chartHeight + padding.top);
      ctx.lineTo(padding.left, chartHeight + padding.top);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Draw points
    ctx.fillStyle = color;
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * chartWidth + padding.left;
      const y = chartHeight - ((data[i].value - minValue) / (maxValue - minValue)) * chartHeight + padding.top;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [data, color, yAxisLabel]);

  if (data.length === 0) {
    return (
      <div 
        style={{ height, width }}
        className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      )}
      <div style={{ height, width: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default LineChart;