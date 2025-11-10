
import React, { useState } from 'react';
import type { Subscription } from '../types';
import { LocationIcon, CloseIcon } from './icons';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (subscription: Subscription) => void;
}

const CROP_OPTIONS = ["rice", "wheat", "maize", "cotton", "sugarcane", "pulses", "vegetables"];

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [crop, setCrop] = useState(CROP_OPTIONS[0]);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const handleGetLocation = () => {
    setIsLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(4));
        setLon(position.coords.longitude.toFixed(4));
        setIsLocating(false);
      },
      (err) => {
        setError('Could not get location. Please enter it manually.');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lon) {
      setError('Latitude and Longitude are required.');
      return;
    }
    setError('');
    onSubscribe({
      crop,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      plantingDate: plantingDate || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <CloseIcon />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Subscribe to Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get personalized notifications for your crops.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Crop Type</label>
              <select
                id="crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                {CROP_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            
            <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
                <LocationIcon />
                {isLocating ? 'Getting Location...' : 'Use My Current Location'}
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                  <input
                    type="number"
                    id="lat"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    placeholder="e.g., 28.6139"
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="lon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                  <input
                    type="number"
                    id="lon"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    required
                    placeholder="e.g., 77.2090"
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
            </div>

            <div>
              <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Planting Date (Optional)</label>
              <input
                type="date"
                id="plantingDate"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:ring-offset-gray-800"
                >
                    Subscribe
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
