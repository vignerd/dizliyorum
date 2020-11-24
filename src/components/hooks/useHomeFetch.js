import { useState, useEffect } from 'react';
import {
  POPULAR_BASE_URL,
  SEARCH_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  IMAGE_BASE_URL,
  POPULAR_BASE_URL_TV,
} from '../../config/apiConfig';

export const useHomeFetch = () => {
  const [state, setState] = useState({ movies: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // const dummyFunction = (endpoint1, endpoint2) => {
  //   const isLoadMore = endpoint1.search('page');
  //   Promise.all([fetch(endpoint1), fetch(endpoint2)])
  //     .then(function (responses) {
  //       return Promise.all(
  //         responses.map(function (response) {
  //           return response.json();
  //         })
  //       );
  //     })
  //     .then(function (data) {
  //       data[0].results.forEach((movie) => {
  //         movie.isMovie = 'true';
  //       });
  //       data[1].results.forEach((tv) => {
  //         tv.isTv = 'true';
  //       });

  //       console.log(endpoint1, endpoint2);

  //       let d = Promise.resolve(data);
  //       d.then((value) => {
  //         setTestState((prev) => ({
  //           ...prev,
  //           movies:
  //             isLoadMore !== -1
  //               ? [...prev.movies, ...data[0].results]
  //               : [...data[0].results],
  //           heroImage: prev.heroImage || data[0].results[0],
  //           currentPage: data[0].page,
  //           totalPages: data[0].total_pages,
  //           tvs:
  //             isLoadMore !== -1
  //               ? [...prev.tvs, ...data[1].results]
  //               : [...data[1].results],
  //           currentPage: data[0].page,
  //           totalPages: data[0].total_pages,
  //         }));
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const fetchMovies = async (endpoint) => {
    setError(false);
    setLoading(true);

    const isLoadMore = endpoint.search('page');

    try {
      const result = await (await fetch(endpoint)).json();
      console.log(result);
      if (result.results.length === 0) {
        setState((prev) => ({
          ...prev,
          movies: [{}],
          heroImage: prev.heroImage || result.results[0],
          currentPage: result.page,
          totalPages: result.total_pages,
          notFound: true,
        }));
        setLoading(false);
      } else {
        setState((prev) => ({
          ...prev,
          movies:
            isLoadMore !== -1
              ? [...prev.movies, ...result.results]
              : [...result.results],

          heroImage: prev.heroImage || result.results[0],
          currentPage: result.page,
          totalPages: result.total_pages,
          notFound: false,
        }));
        setLoading(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies(POPULAR_BASE_URL);
  }, []);

  return [{ state, loading, error }, fetchMovies];
};
