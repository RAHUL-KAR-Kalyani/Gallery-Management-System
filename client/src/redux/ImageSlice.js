import { createSlice } from "@reduxjs/toolkit";

const ImageSlice = createSlice({
    name: 'image',
    initialState: {
        loading: false,
        images: [],
        searchImagebyname: '',
        selectedImage: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setSearchImageByName: (state, action) => {
            state.searchImagebyname = action.payload;
        },
        setSelectedImage: (state, action) => {
            state.selectedImage = action.payload;
        },
        uploadImages: (state, action) => {
            state.images.push(...action.payload);
        },
        updateImages: (state, action) => {
            const { id, updatedImage } = action.payload;
            const index = state.images.findIndex(image => image._id === id);
            if (index !== -1) {
                state.images[index] = updatedImage;
            }
        },
        // deleteImages: (state, action) => {
        //     const idsToDelete = action.payload;
        //     state.images = state.images.filter(image => !idsToDelete.includes(image._id));
        // },
        deleteImages: (state, action) => {
            state.images = state.images.filter(image => image._id !== action.payload._id);
        }

    }
})

export const { setLoading, setImages, setSelectedImage, uploadImages, updateImages, deleteImages, setSearchImageByName } = ImageSlice.actions;
export default ImageSlice.reducer;