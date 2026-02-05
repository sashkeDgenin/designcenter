'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    description: '',
    mustHave: '',
    mustAvoid: '',
    inspirationLinks: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'API returned an error');
      }

      const data = await response.json();

      if (!data.report) {
        throw new Error('No report was generated. The AI response may have been malformed.');
      }

      sessionStorage.setItem('styleReport', JSON.stringify(data.report));
      router.push('/report');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-2">For Interior Designers</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Design Alignment Contract</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Turn vague client input into a binding design direction — before the project starts.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Progress hint */}
          <div className="bg-blue-50 border-b border-blue-100 px-8 py-3">
            <p className="text-sm text-blue-700 font-medium">Step 1 of 2 — Client Input</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="projectType" className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type *
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select a project type</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Office">Office</option>
                <option value="Full Home">Full Home</option>
                <option value="Commercial">Commercial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                What does the client want? *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Paste or type exactly what the client said — no filtering, no cleanup. The messier, the better."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="mustHave" className="block text-sm font-semibold text-gray-700 mb-2">
                Must-Have Elements
              </label>
              <textarea
                id="mustHave"
                name="mustHave"
                rows={3}
                value={formData.mustHave}
                onChange={handleChange}
                placeholder="What absolutely cannot be missing? (e.g. 'natural light', 'storage', 'a reading nook')"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="mustAvoid" className="block text-sm font-semibold text-gray-700 mb-2">
                Must-Avoid Elements
              </label>
              <textarea
                id="mustAvoid"
                name="mustAvoid"
                rows={3}
                value={formData.mustAvoid}
                onChange={handleChange}
                placeholder="What will make the client walk away? (e.g. 'anything cold', 'too trendy', 'open plan')"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="inspirationLinks" className="block text-sm font-semibold text-gray-700 mb-2">
                Inspiration Links
              </label>
              <textarea
                id="inspirationLinks"
                name="inspirationLinks"
                rows={3}
                value={formData.inspirationLinks}
                onChange={handleChange}
                placeholder="Pinterest, Instagram, Houzz — one link per line"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base tracking-wide"
            >
              {loading ? 'Generating Contract...' : 'Generate Alignment Contract'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Output is a binding design alignment document — not just a mood board.
        </p>
      </div>
    </div>
  );
}
