import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

const Repos: React.FC = () => {
  const [repos, setRepos] = useState<string[]>([]);
  const [repo, setRepo] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Repo[]>([]);

  // Add a new repository to the list
  const addRepo = (repo: string) => {
    setRepos([...repos, repo]);
    setRepo(''); // Clear the input field after adding
  };

  // Search GitHub repositories based on user input
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${query}+in:name,description&sort=stars&order=desc`
      );
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  // Link GitHub to display starred repositories (this is just a placeholder)
  const handleGitHubLink = () => {
    // Implement OAuth or GitHub linking logic here
    alert('GitHub linked! Showing starred repositories...');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="text-3xl font-bold mb-6 text-white"
      >
        Best Repositories for Ethical Hackers and Penetration Testers
      </motion.h1>

      {/* Link GitHub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        <button
          onClick={handleGitHubLink}
          className="bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Github className="w-5 h-5 mr-2" />
          Link GitHub
        </button>
      </motion.div>

      {/* Search Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Search GitHub Repositories</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by repo name or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleSearch}
            className="bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.6 }}
            className="mt-4"
          >
            {searchResults.map((repo) => (
              <motion.li
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.8 }}
                className="mb-2"
              >
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                  {repo.name} - {repo.description}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>

      {/* Add a New Repository */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 1 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Add New Repository</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addRepo(repo);
          }}
          className="flex gap-4"
        >
          <input
            type="text"
            placeholder="Enter repository URL"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button type="submit" className="bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors">
            Add
          </button>
        </form>
      </motion.div>

      {/* Display Curated List of Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 1.2 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Curated Repositories</h2>
        <ul className="list-disc list-inside text-white">
          {repos.map((repo, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 1.4 }}
              className="mb-2"
            >
              {repo}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Repos;
