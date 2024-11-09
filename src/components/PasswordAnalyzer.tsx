import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import zxcvbn from 'zxcvbn';

export interface PasswordStrength {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crackTime: string;
}

export const PasswordAnalyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength({
        score: result.score,
        feedback: result.feedback,
        crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
      });
    } else {
      setStrength(null);
    }
  }, [password]);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'N/A';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="text-emerald-600" />
          Password Strength Analyzer
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg pr-24"
                placeholder="Enter password to analyze..."
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm
                  text-gray-600 hover:text-gray-900"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {strength && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Strength: {getScoreLabel(strength.score)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Crack time: {strength.crackTime}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getScoreColor(strength.score)}`}
                    style={{ width: `${(strength.score + 1) * 20}%` }}
                  />
                </div>
              </div>

              {(strength.feedback.warning || strength.feedback.suggestions.length > 0) && (
                <div className="space-y-3">
                  {strength.feedback.warning && (
                    <div className="flex items-start gap-2 text-orange-600">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{strength.feedback.warning}</p>
                    </div>
                  )}
                  
                  {strength.feedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-blue-600">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}

              {strength.score === 4 && (
                <div className="flex items-start gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>This is a strong password! Make sure to store it securely.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}