import React, { useEffect, useState, useCallback } from 'react';
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { injectContentScript } from '../utils/contentScriptInjector';

interface SpotifySession {
  clientId: string | null;
  accessToken: string | null;
  user: any;
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTrack: Track | null;
  progress: number;
  volume: number;
}

const SpotifyPlayer: React.FC = () => {
  const [session, setSession] = useState<SpotifySession>({
    clientId: null,
    accessToken: null,
    user: null
  });
  const [status, setStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    tracks: Track[];
    playlists: any[];
    podcasts: any[];
  }>({ tracks: [], playlists: [], podcasts: [] });
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTrack: null,
    progress: 0,
    volume: 50
  });
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  // Spotify API Endpoints
  const spotifyApi = {
    search: async (query: string, types: string[] = ['track', 'playlist', 'show']) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${types.join(',')}`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          }
        );
        return await response.json();
      } catch (error) {
        console.error('Search failed:', error);
        throw error;
      }
    },

    getUserPlaylists: async () => {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/playlists',
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          }
        );
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
        throw error;
      }
    },

    getPlaylistTracks: async (playlistId: string) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          }
        );
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch playlist tracks:', error);
        throw error;
      }
    },

    playTrack: async (trackUri: string) => {
      try {
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          },
          body: JSON.stringify({
            uris: [trackUri]
          })
        });
      } catch (error) {
        console.error('Playback failed:', error);
        throw error;
      }
    },

    togglePlayback: async () => {
      try {
        const endpoint = playbackState.isPlaying ? 'pause' : 'play';
        await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        setPlaybackState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
      } catch (error) {
        console.error('Toggle playback failed:', error);
        throw error;
      }
    },

    setVolume: async (volume: number) => {
      try {
        await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        setPlaybackState(prev => ({ ...prev, volume }));
      } catch (error) {
        console.error('Volume control failed:', error);
        throw error;
      }
    },

    toggleLike: async (trackId: string) => {
      try {
        const method = likedSongs.has(trackId) ? 'DELETE' : 'PUT';
        await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
          method,
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        setLikedSongs(prev => {
          const newSet = new Set(prev);
          if (prev.has(trackId)) {
            newSet.delete(trackId);
          } else {
            newSet.add(trackId);
          }
          return newSet;
        });
      } catch (error) {
        console.error('Like toggle failed:', error);
        throw error;
      }
    }
  };

  // Search handler
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const results = await spotifyApi.search(query);
      setSearchResults({
        tracks: results.tracks?.items || [],
        playlists: results.playlists?.items || [],
        podcasts: results.shows?.items || []
      });
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  }, [session.accessToken]);

  // Fetch user playlists on mount
  useEffect(() => {
    if (session.accessToken) {
      spotifyApi.getUserPlaylists().then(data => {
        setUserPlaylists(data.items);
      });
    }
  }, [session.accessToken]);

  // Playback progress updater
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (playbackState.isPlaying) {
      progressInterval = setInterval(() => {
        setPlaybackState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 1000, prev.currentTrack?.duration_ms || 0)
        }));
      }, 1000);
    }

    return () => clearInterval(progressInterval);
  }, [playbackState.isPlaying]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Spotify Player</h1>
          {session.user && (
            <div className="flex items-center space-x-4">
              <img
                src={session.user.images?.[0]?.url || "/api/placeholder/40/40"}
                alt={session.user.display_name}
                className="w-10 h-10 rounded-full"
              />
              <span>{session.user.display_name}</span>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tracks, playlists, or podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full bg-gray-800 border-none"
            />
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => handleSearch(searchQuery)}
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="search" className="mb-8">
          <TabsList>
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="playlists">Your Playlists</TabsTrigger>
            <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.tracks.map(track => (
                <div
                  key={track.id}
                  className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4"
                >
                  <img
                    src={track.album.images[0]?.url || "/api/placeholder/64/64"}
                    alt={track.album.name}
                    className="w-16 h-16 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{track.name}</h3>
                    <p className="text-sm text-gray-400">{track.artists[0].name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => spotifyApi.toggleLike(track.id)}
                      className="p-2 hover:bg-gray-700 rounded-full"
                    >
                      <Heart
                        className={likedSongs.has(track.id) ? 'text-green-500' : 'text-gray-400'}
                      />
                    </button>
                    <button
                      onClick={() => spotifyApi.playTrack(`spotify:track:${track.id}`)}
                      className="p-2 hover:bg-gray-700 rounded-full"
                    >
                      <Play />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userPlaylists.map(playlist => (
                <div
                  key={playlist.id}
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => spotifyApi.getPlaylistTracks(playlist.id)}
                >
                  <img
                    src={playlist.images[0]?.url || "/api/placeholder/200/200"}
                    alt={playlist.name}
                    className="w-full aspect-square rounded mb-2"
                  />
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-400">{playlist.tracks.total} tracks</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Playback Controls */}
        {playbackState.currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={playbackState.currentTrack.album.images[0]?.url || "/api/placeholder/48/48"}
                  alt={playbackState.currentTrack.album.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h4 className="font-semibold">{playbackState.currentTrack.name}</h4>
                  <p className="text-sm text-gray-400">
                    {playbackState.currentTrack.artists[0].name}
                  </p>
                </div>
              </div>

              <div className="flex-1 max-w-xl mx-8">
                <div className="flex items-center justify-center space-x-4">
                  <button className="p-2 hover:bg-gray-700 rounded-full">
                    <SkipBack />
                  </button>
                  <button
                    onClick={() => spotifyApi.togglePlayback()}
                    className="p-3 bg-green-500 hover:bg-green-600 rounded-full"
                  >
                    {playbackState.isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full">
                    <SkipForward />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span>{formatDuration(playbackState.progress)}</span>
                  <Slider
                    value={[playbackState.progress]}
                    max={playbackState.currentTrack.duration_ms}
                    className="flex-1"
                  />
                  <span>{formatDuration(playbackState.currentTrack.duration_ms)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="text-gray-400" />
                <Slider
                  value={[playbackState.volume]}
                  max={100}
                  className="w-24"
                  onValueChange={([value]) => spotifyApi.setVolume(value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyPlayer;