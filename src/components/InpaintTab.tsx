'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function InpaintTab() {
  const [image, setImage] = useState<File | null>(null);
  const [mask, setMask] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maskPreviewUrl, setMaskPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMask(file);
      setMaskPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInpaint = async () => {
    if (!image || !prompt) {
      setError('Please provide an image and prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      if (mask) {
        formData.append('mask', mask);
      }
      formData.append('prompt', prompt);

      const response = await fetch('/api/inpaint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to inpaint image');
      }

      const data = await response.json();
      setResultImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid-container">
        <div className="card">
          <label className="form-group">
            Original Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
          {previewUrl && (
            <div className="image-container">
              <Image
                src={previewUrl}
                alt="Original image"
                fill
                className="image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        <div className="card">
          <label className="form-group">
            Mask Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMaskChange}
            className="form-control"
          />
          {maskPreviewUrl && (
            <div className="image-container">
              <Image
                src={maskPreviewUrl}
                alt="Mask image"
                fill
                className="image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <label htmlFor="prompt" className="form-group">
          Inpainting Prompt
        </label>
        <div>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            className="form-control"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to paint in the masked area..."
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleInpaint}
            disabled={loading}
            className="btn"
          >
            {loading ? (
              <>
                <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inpainting...
              </>
            ) : (
              'Inpaint Image'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="error">
          <div>
            <div>
              <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3>Error</h3>
              <div>{error}</div>
            </div>
          </div>
        </div>
      )}

      {resultImage && (
        <div className="card">
          <h3>Result</h3>
          <div className="image-container">
            <Image
              src={resultImage}
              alt="Inpainted image"
              fill
              className="image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      )}
    </div>
  );
} 