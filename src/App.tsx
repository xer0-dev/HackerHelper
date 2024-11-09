import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar'; // NEED IMPORTS IN CODE
import { PasswordAnalyzer } from './components/PasswordAnalyzer'; // DONE
import Crypto from './components/Crypto'; // DONE
import MindMaps from './pages/MindMaps'; // 90%
import SecurityScanner from './components/Tools'; // TEST THE pySERVER
import Repos from './pages/Repos'; // DESIGN
import Notes from './components/Notes'; // DONE
import Tasks from './components/Tasks'; // DONE
import Break from './components/Break'; // DONE
import SoundPlayer from './components/SoundPlayer'; // ALMOST
import ProjectManager from './core/ProjectManager'; // NEW

function App() {
  const [activeTab, setActiveTab] = useState('hash');

  const renderContent = () => {
    switch (activeTab) {

      case 'Password':
        return <PasswordAnalyzer />;
      case 'CryptoGraphy':
        return <Crypto />; 
      case 'Security':
        return <SecurityScanner />;
      case 'MindMaps':
        return <MindMaps />;
      case 'Repos':
        return <Repos />;
      case 'Notes':
        return <Notes />;
      case 'Tasks':
        return <Tasks />;
      case 'Break':
        return <Break />;
      case 'SoundPlayer':
        return <SoundPlayer />;
      case 'ProjectManager':
        return <ProjectManager />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a tool from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;