import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';

const BACKEND_URL = 'http://localhost:5000';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);
  
  //Lấy dữ liệu phim
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu phim');
      }

      const data = await response.json();

      if(data.response === 'False') {
        setErrorMessage(data.Error || 'Lỗi khi lấy dữ liệu phim');
      }

      setMovieList(data.results || []);

      if(query && data.results && data.results.length > 0) {
        updateSearchCount(data.results[0]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu phim:', error);
      setErrorMessage('Lỗi khi lấy dữ liệu phim.');
      setMovieList([]);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  //Cập nhật số lần tìm kiếm
  const updateSearchCount = async (movie) => {
    if(!movie) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/update-search-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
        })
      });

      if(!response.ok) {
        throw new Error('Lỗi khi cập nhật số lần tìm kiếm');
      }

      const data = await response.json();

      if(data.success) {
        console.log(`Đã cập nhật số lần tìm kiếm cho "${movie.title}"`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lần tìm kiếm:', error);
    }
  }

  //Lấy phim thịnh hành
  const loadTrendingMovies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get-trending-movies`);
      
      const data = await response.json();

      setTrendingMovies(data.movies);
    } catch (error) {
      console.error('Lỗi khi lấy phim thịnh hành:', error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Tìm kiếm <span className="text-gradient">bộ phim</span> bạn sẽ thích mà không phải lo lắng</h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Phim thịnh hành</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie._id}>
                  <p>{index + 1}</p>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>Tất cả phim</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App