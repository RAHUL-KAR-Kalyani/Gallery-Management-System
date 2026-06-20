import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlbums } from '../redux/albumSlice';
import { toast } from 'sonner';
import axios from 'axios';

const useGetOwnAlbum = () => {
    const dispatch = useDispatch();
    const hasfetched = useRef(false);

    const { user } = useSelector((store) => store.auth);
    const { albums } = useSelector((store) => store.album);

    const role = user?.role.toLowerCase();
    const isAdmin = role === 'admin';

    useEffect(() => {
        if (hasfetched.current) return;
        hasfetched.current = true;
        if (!albums) return;

        const fetchAlbums = async () => {
            try {
                let response = await axios.get(`${import.meta.env.VITE_ALBUM_ENDPOINT}/get/user/${user._id}`, { withCredentials: true });
                
                if (response?.data?.success) {
                    console.log(response?.data, " albums to dispatch");
                    dispatch(setAlbums(response?.data?.albums))
                }

            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message);
            }
        }
        fetchAlbums();
    }, [albums, isAdmin])
}

export default useGetOwnAlbum