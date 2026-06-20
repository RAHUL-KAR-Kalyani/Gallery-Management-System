import { createSlice } from "@reduxjs/toolkit";

const albumSlice = createSlice({
    name: 'album',
    initialState: {
        albums: [],
        loading: false,
        searchAlbumbyname: '',
        selectedAlbum: null,
        sharedAlbum: null,
    },

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setSearchAlbumByName: (state, action) => {
            state.searchAlbumbyname = action.payload;
        },

        setSelectedAlbum: (state, action) => {
            state.selectedAlbum = action.payload;
        },

        setAlbums: (state, action) => {
            state.albums = action.payload;
        },

        createAlbum: (state, action) => {
            state.albums.unshift(action.payload);
        },

        updateAlbum: (state, action) => {
            const updatedAlbum = action.payload;
            state.albums = state.albums.map((album) => album._id === updatedAlbum._id ? updatedAlbum : album);
            if (
                state.selectedAlbum &&
                state.selectedAlbum._id === updatedAlbum._id
            ) {
                state.selectedAlbum = updatedAlbum;
            }
        },
        renameAlbum: (state, action) => {
            const { id, name } = action.payload;

            state.albums = state.albums.map((album) => album._id === id ? { ...album, name } : album);

            if (state.selectedAlbum && state.selectedAlbum._id === id) {
                state.selectedAlbum = { ...state.selectedAlbum, name };
            }
        },

        deleteAlbum: (state, action) => {
            const albumId = action.payload;
            state.albums = state.albums.filter((album) => album._id !== albumId);
            if (
                state.selectedAlbum &&
                state.selectedAlbum._id === albumId
            ) {
                state.selectedAlbum = null;
            }
        },

        setSharedAlbum: (state, action) => {
            state.sharedAlbum = action.payload;
        },
    }
});

export const {
    setLoading,
    setSearchAlbumByName,
    setSelectedAlbum,
    setAlbums,
    createAlbum,
    updateAlbum,
    renameAlbum,
    deleteAlbum,
    setSharedAlbum,
} = albumSlice.actions;

export default albumSlice.reducer;