import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  AlertTriangle 
} from 'lucide-react';
import { ReconScanner } from '../utils/hooks/Recon';
import { VulnerabilityScanner } from '../utils/hooks/Vulnerability';
import { NetworkScanner } from '../utils/hooks/NetworkScanner';
import { ScanResult } from '../utils/securityScanner';

const SecurityTools = () => {
  const [activeTab, setActiveTab] = useState('vulnerability');
  const [target, setTarget] = useState('');
  const [selectedScans, setSelectedScans] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reconScanner = new ReconScanner();
  const vulnerabilityScanner = new VulnerabilityScanner();
  const networkScanner = new NetworkScanner();

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(e.target.value);
  };

  const handleScanSelect = (scan: string) => {
    setSelectedScans(prevScans => {
      if (prevScans.includes(scan)) {
        return prevScans.filter(s => s !== scan);
      } else {
        return [...prevScans, scan];
      }
    });
  };

  const handleScan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: ScanResult;

      switch (activeTab) {
        case 'vulnerability':
          result = await vulnerabilityScanner.runSelectedScans(target, selectedScans);
          break;
        case 'network':
          result = await networkScanner.runSelectedScans(target, selectedScans);
          break;
        case 'recon':
          result = await reconScanner.runSelectedScans(target, selectedScans);
          break;
        default:
          throw new Error('Invalid scan type.');
      }

      setScanResult(result);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const vulnerabilityScans = [
    { id: 'xss', icon: Shield, label: 'XSS' },
    { id: 'csrf', icon: Shield, label: 'CSRF' },
    { id: 'clickjacking', icon: Shield, label: 'Clickjacking' },
    { id: 'sql-injection', icon: Shield, label: 'SQL Injection' },
    { id: 'ssl-tls', icon: Shield, label: 'SSL/TLS' },
    { id: 'fully-vuln-scan', icon: Shield, label: 'Comprehensive Scan' }
  ];

  const networkScans = [
    { id: 'http-enum', icon: Database, label: 'HTTP Enumeration' },
    { id: 'ssl-enum', icon: Database, label: 'SSL Enumeration' },
    { id: 'dns-brute', icon: Database, label: 'DNS Brute Force' },
    { id: 'smb-enum', icon: Database, label: 'SMB Enumeration' },
    { id: 'mysql-enum', icon: Database, label: 'MySQL Enumeration' },
    { id: 'nmap-scan', icon: Database, label: 'NMAP Scan' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="text-emerald-600" />
          Security Tools
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('vulnerability')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${activeTab === 'vulnerability' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-white/5'
                }`}
            >
              <Shield className="w-5 h-5" />
              <span>Vulnerability Scans</span>
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${activeTab === 'network' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-white/5'
                }`}
            >
              <Database className="w-5 h-5" />
              <span>Network Scans</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL or IP Address
              </label>
              <input
                type="text"
                value={target}
                onChange={handleTargetChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter target..."
              />
            </div>

            {activeTab === 'vulnerability' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vulnerability Scans
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {vulnerabilityScans.map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => handleScanSelect(scan.id)}
                      className={`p-4 rounded-lg flex items-center justify-center gap-2 
                        ${selectedScans.includes(scan.id)
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <scan.icon className="w-5 h-5" />
                      <span>{scan.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Network Scans
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {networkScans.map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => handleScanSelect(scan.id)}
                      className={`p-4 rounded-lg flex items-center justify-center gap-2
                        ${selectedScans.includes(scan.id)
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <scan.icon className="w-5 h-5" />
                      <span>{scan.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleScan}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 
                transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Scanning...' : 'Scan'}
            </button>

            {error && (
              <div className="flex items-start gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {scanResult && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Results
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(scanResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTools;
