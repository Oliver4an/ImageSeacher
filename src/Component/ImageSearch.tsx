// ImageSearch.tsx
import axios from "axios";
import { useState, FormEvent } from "react";

interface Image {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  alt_description: string;
}

function ImageSearch() {
  const [query, setQuery] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const API_KEY = "uBU7duVZGD4ZcU-cC3-FK00473AuyHidAeWDasTTlWA";

  const searchImages = async (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    fetchImages(1, query);
  };

  const fetchImages = async (pageNumber: number, searchQuery: string) => {
    setLoading(true);
    setError("");

    const API_URL = `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${pageNumber}&per_page=20&client_id=${API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      if (pageNumber === 1) {
        setImages(response.data.results);
      } else {
        setImages((prevImages) => [...prevImages, ...response.data.results]);
      }
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, query);
  };

  const downloadImage = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h2>Image Search App</h2>
      <form onSubmit={searchImages}>
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading">Loading images...</p>}
      {error && <p className="error">{error}</p>}

      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.urls.small} alt={image.alt_description} />
            <button onClick={() => downloadImage(image.urls.full)}>
              Download
            </button>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <button className="load-more" onClick={loadMoreImages}>
          Load More
        </button>
      )}
    </div>
  );
}

export default ImageSearch;
