import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FavoriteCards from '../pages/favoritescards';
import {PokemonCards} from '../pages/pokemoncards';
import { NotFound } from '../components/NotFound';
import { Layout } from '../components/Layout';

function Routers() {
  return (
    <Routes>
      <Route element={<Layout />}>  
        <Route path="/" element={<PokemonCards />} />
        <Route path="/capturados" element={<FavoriteCards />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routers;
