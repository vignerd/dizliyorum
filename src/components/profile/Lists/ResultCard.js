import React from 'react';
import '../../../Results.css';
import { navigate } from '@reach/router';

export const ResultCard = ({ movie, index, id, children }) => {
  const handleClick = (movie) => {
    movie.title
      ? navigate(`/${movie.id}`, { state: { id } })
      : navigate(`/tvserials/${movie.id}`, { state: { id } });
  };

  return (
    <div className="result-card">
      <div
        onClick={() => {
          handleClick(movie);
        }}
        className="poster-wrapper"
      >
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={`${movie.title} Poster`}
          />
        ) : (
          <div className="filler-poster"></div>
        )}
      </div>

      <div className="info">
        <div
          onClick={() => {
            handleClick(movie);
          }}
          className="header"
        >
          <h3 className="title">
            {index + 1}.{movie.title ? movie.title : movie.name}
          </h3>
          {movie.release_date ? (
            <h4 className="release-date">
              {movie.release_date.substring(0, 4)}
            </h4>
          ) : movie.status === 'Ended' ? (
            <h4 className="release-date">
              {movie.first_air_date.substring(0, 4) +
                '-' +
                movie.last_air_date.substring(0, 4)}
            </h4>
          ) : (
            <h4 className="release-date">
              {movie.first_air_date.substring(0, 4) + '-'}
            </h4>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
