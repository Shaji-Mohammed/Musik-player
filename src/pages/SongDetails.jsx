import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetRelatedSongsQuery, useGetSongDetailsQuery } from '../redux/services/spotify';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songData, isFetching: isFetchingSongDetails } = useGetSongDetailsQuery({ songid });
  const { resources, isFetching: isFetchingRelatedSongs, error } = useGetRelatedSongsQuery({ songid });

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, resources, i }));
    dispatch(playPause(true));
  };

  if (isFetchingSongDetails || isFetchingRelatedSongs) {
    return <Loader title="Searching song details" />;
  }

  if (error) return <Error />;

  return (
    <div>
      <DetailsHeader artistId="" songData={songData} />
      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics: </h2>
        <div className="mt-5">
          {songData?.sections[1].type === 'LYRICS'
            ? songData?.sections[1].text.map((line) => (
              <p className="text-gray-400 text-base my-1">{line}</p>)) : <p className="text-gray-400 text-base my-1">Sorry, no lyrics found!</p> }
        </div>
      </div>

      <RelatedSongs
        resources={resources}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
