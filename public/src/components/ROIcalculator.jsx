import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Calculator, Target } from 'lucide-react';

const ROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timeframe, setTimeframe] = useState('1');
  const [timeUnit, setTimeUnit] = useState('years');
  const [additionalInvestments, setAdditionalInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({ amount: '', period: '' });

  const calculations = useMemo(() => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const time = parseFloat(timeframe) || 1;
    
    if (initial === 0) return null;

    const totalGain = final - initial;
    const roiPercentage = (totalGain / initial) * 100;
    const annualizedROI = timeUnit === 'years' && time > 0 
      ? (Math.pow(final / initial, 1 / time) - 1) * 100
      : roiPercentage;

    return {
      initialInvestment: initial,
      finalValue: final,
      totalGain,
      roiPercentage,
      annualizedROI,
      timeframe: time,
      timeUnit
    };
  }, [initialInvestment, finalValue, timeframe, timeUnit]);

  const addInvestment = () => {
    if (newInvestment.amount && newInvestment.period) {
      setAdditionalInvestments([...additionalInvestments, {
        id: Date.now(),
        amount: parseFloat(newInvestment.amount),
        period: parseFloat(newInvestment.period)
      }]);
      setNewInvestment({ amount: '', period: '' });
    }
  };

  const removeInvestment = (id) => {
    setAdditionalInvestments(additionalInvestments.filter(inv => inv.id !== id));
  };

  const chartData = useMemo(() => {
    if (!calculations) return [];
    
    return [
      {
        name: 'Initial Investment',
        value: calculations.initialInvestment,
        color: '#ef4444'
      },
      {
        name: 'Total Gain/Loss',
        value: Math.abs(calculations.totalGain),
        color: calculations.totalGain >= 0 ? '#10b981' : '#ef4444'
      }
    ];
  }, [calculations]);

  const pieData = useMemo(() => {
    if (!calculations) return [];
    
    const data = [
      {
        name: 'Initial Investment',
        value: calculations.initialInvestment,
        color: '#E7B8C7'
      }
    ];

    if (calculations.totalGain > 0) {
      data.push({
        name: 'Profit',
        value: calculations.totalGain,
        color: '#10b981'
      });
    } else if (calculations.totalGain < 0) {
      data.push({
        name: 'Loss',
        value: Math.abs(calculations.totalGain),
        color: '#ef4444'
      });
    }

    return data;
  }, [calculations]);

  const timelineData = useMemo(() => {
    if (!calculations) return [];
    
    const points = [];
    const steps = Math.min(10, Math.max(2, calculations.timeframe));
    
    for (let i = 0; i <= steps; i++) {
      const period = (calculations.timeframe * i) / steps;
      const value = calculations.initialInvestment + (calculations.totalGain * i) / steps;
      points.push({
        period: period.toFixed(1),
        value: value,
        investment: calculations.initialInvestment
      });
    }
    
    return points;
  }, [calculations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-6" style={{ background: 'linear-gradient(to bottom right, #f9f1f3, #E7B8C7)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Calculator style={{ color: '#B8739E' }} />
            ROI Calculator
          </h1>
          <p className="text-gray-600">Calculate and visualize your return on investment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="text-green-600" />
                Investment Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                    style={{ '--tw-ring-color': '#E7B8C7' }}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Value ($)
                  </label>
                  <input
                    type="number"
                    value={finalValue}
                    onChange={(e) => setFinalValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                    style={{ '--tw-ring-color': '#E7B8C7' }}
                    placeholder="12000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Period
                    </label>
                    <input
                      type="number"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      style={{ '--tw-ring-color': '#E7B8C7' }}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={timeUnit}
                      onChange={(e) => setTimeUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      style={{ '--tw-ring-color': '#E7B8C7' }}
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              {calculations && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Results Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Gain/Loss:</span>
                      <span className={`font-semibold ${calculations.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${calculations.totalGain.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Percentage:</span>
                      <span className={`font-semibold ${calculations.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculations.roiPercentage.toFixed(2)}%
                      </span>
                    </div>
                    {timeUnit === 'years' && calculations.timeframe > 1 && (
                      <div className="flex justify-between">
                        <span>Annualized ROI:</span>
                        <span className={`font-semibold ${calculations.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {calculations.annualizedROI.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {calculations && (
              <>
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp style={{ color: '#B8739E' }} />
                    Investment vs Returns
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Bar dataKey="value" fill="#E7B8C7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target style={{ color: '#B8739E' }} />
                    Investment Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Investment Growth Timeline
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        label={{ value: `Time (${timeUnit})`, position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                      <Tooltip 
                        formatter={(value, name) => [
                          `$${value.toLocaleString()}`, 
                          name === 'value' ? 'Portfolio Value' : 'Initial Investment'
                        ]} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="investment" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        name="investment"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f5eff1' }}>
                      <div className="text-2xl font-bold" style={{ color: '#B8739E' }}>
                        ${calculations.initialInvestment.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Initial Investment</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${calculations.finalValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Final Value</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className={`text-2xl font-bold ${calculations.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculations.roiPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Total ROI</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className={`text-2xl font-bold ${calculations.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculations.annualizedROI.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {timeUnit === 'years' ? 'Annualized' : 'Period'} ROI
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!calculations && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your investment details to see visualizations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
