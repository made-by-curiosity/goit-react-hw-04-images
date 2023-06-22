import { useState, useEffect } from 'react';
import { Searchbar } from '../Searchbar/Searchbar';
import { PhotoApp } from './App.styled';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { getPhotos } from '../../services/getPhotos';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Modal } from 'components/Modal/Modal';

export const App = () => {
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    async function fetchPhotos() {
      const response = await getPhotos(searchQuery, page, perPage);
      setImages(response.data.hits);
      setLoading(false);
      setTotalImages(response.data.totalHits);
    }

    fetchPhotos();
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery === '' || page === 1) {
      return;
    }

    async function fetchMorePhotos() {
      const response = await getPhotos(searchQuery, page, perPage);
      setImages(images => [...images, ...response.data.hits]);
      setLoading(false);
    }

    fetchMorePhotos();
  }, [page]);

  const isContentLeft = () => {
    return totalImages > page * perPage;
  };

  const onSearch = ({ searchQuery }) => {
    setSearchQuery(searchQuery);
    setPage(1);
    setLoading(true);
    setImages([]);
    setTotalImages(0);
  };

  const handleLoadMore = () => {
    setPage(page => page + 1);
    setLoading(true);
  };

  const setActivePhoto = index => {
    setActivePhotoIndex(index);
  };

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const contentLeft = isContentLeft();

  return (
    <PhotoApp>
      <Searchbar onSubmit={onSearch} />
      <ImageGallery
        images={images}
        setActivePhoto={setActivePhoto}
        toggleModal={toggleModal}
      />
      {images.length > 0 && !loading && contentLeft && (
        <Button onLoadMore={handleLoadMore} />
      )}
      {loading && <Loader />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img
            src={images[activePhotoIndex].largeImageURL}
            alt={images[activePhotoIndex].tags}
          />
        </Modal>
      )}
    </PhotoApp>
  );
};
