import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function Crypto() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [algorithm, setAlgorithm] = useState('AES');
  const [copied, setCopied] = useState(false);

  const algorithms = {
    AES: {
      encrypt: (text: string, key: string) => CryptoJS.AES.encrypt(text, key).toString(),
      decrypt: (text: string, key: string) => {
        try {
          return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
        } catch {
          return 'Decryption failed. Check your key and input.';
        }
      }
    }
  };

  const handleProcess = () => {
    if (!input || !key) return;
    
    const result = mode === 'encrypt' 
      ? algorithms.AES.encrypt(input, key)
      : algorithms.AES.decrypt(input, key);
    
    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock className="text-emerald-600" />
          Encryption Suite
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setMode('encrypt')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${mode === 'encrypt' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              <Lock className="w-4 h-4" />
              Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${mode === 'decrypt' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              <Unlock className="w-4 h-4" />
              Decrypt
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="AES">AES-256</option>
              <option value="RSA" disabled>RSA (Coming Soon)</option>
              <option value="Blowfish" disabled>Blowfish (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border rounded-lg h-32"
              placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your secret key..."
            />
          </div>

          <button
            onClick={handleProcess}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 
              transition-colors flex items-center justify-center gap-2"
          >
            {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>

          {output && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  value={output}
                  className="w-full p-3 border rounded-lg h-32 bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-lg"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}