import React, { useState, useEffect } from 'react';
import Grid from '../../dashboard/Grid';
import MovieThumb from '../../dashboard/MovieThumb';
import NoImage from '../../images/no_image.jpg';
import Spinner from '../../dashboard/Spinner';
import { useGameHomeFetch } from '../../hooks/useGameHomeFetch';
import { StyledMovieThumb } from '../../styles/StyledMovieThumb';
import { Link } from '@reach/router';

import {
  POPULAR_BASE_URL,
  SEARCH_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  IMAGE_BASE_URL,
  GAME_API_URL,
  KRAKEN_API_KEY,
  KRAKEN_API_KEY_SECRET,
} from '../../../config/apiConfig';
import { useGameFetch } from '../../hooks/useGameFetch';
import SearchBar from '../../dashboard/SearchBar';
import LoadMoreBtn from '../../dashboard/LoadMoreBtn';

var Kraken = require('kraken');

var kraken = new Kraken({
  api_key: KRAKEN_API_KEY,
  api_secret: KRAKEN_API_KEY_SECRET,
});

const GameThumb = ({ image, game, gameSlug, clickable }) => (
  <StyledMovieThumb>
    {clickable ? (
      <Link to={`/oyun/${gameSlug}`}>
        <div className="img_container">
          <img
            className="clickable img_self"
            src={image}
            alt="gamethumb"
            style={{ height: '250px' }}
            name={game.name}
          />
          <div className="overlay">
            <div className="img_text">{game.name}</div>
          </div>
        </div>
      </Link>
    ) : (
      <img src={image} alt="gamethumb" />
    )}
  </StyledMovieThumb>
);

export const NowPlaying = () => {
  const [searchTerm, setSearchTerm] = useState();

  const [{ data, loading }, fetchData] = useGameFetch(searchTerm);

  data.games.forEach((game) => {
    let params = {
      url: game.background_image,
      wait: true,
      resize: {
        width: 100,
        height: 75,
        strategy: 'fit',
      },
    };

    kraken.url(params, function (status) {
      if (status.success) {
        console.log('success', status);
        game.background_image = status.kraked_url;
      } else {
        console.log('Fail', status.message);
      }
    });
  });

  const loadMoreGames = async () => {
    const endpoint = data.next;
    await fetchData(endpoint);
  };

  const searchGames = async (search) => {
    let slug = searchTerm.split(' ').join('-').toLowerCase();

    const endpoint = search ? GAME_API_URL + slug : GAME_API_URL;
    console.log(endpoint);
    await fetchData(endpoint);
    setSearchTerm(search);
  };

  if (!data.games[0]) return <Spinner />;

  return (
    <>
      {console.log(data)}
      <>
        <SearchBar callback={searchGames} />
        <Grid>
          {data.games.map((game) => (
            <GameThumb
              key={game.id}
              clickable
              image={game.background_image}
              game={game}
              gameName={game.name}
              content={game}
              oyunId={game.id}
              gameSlug={game.slug}
            />
          ))}
        </Grid>

        {loading && <Spinner />}
        {!loading ? (
          <LoadMoreBtn text="Load More" callback={loadMoreGames} />
        ) : (
          ''
        )}
      </>
    </>
  );
};
