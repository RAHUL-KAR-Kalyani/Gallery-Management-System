import axios from 'axios';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { setImages } from '../redux/ImageSlice';
import { useDispatch, useSelector } from 'react-redux';

const useGetOwnIMages = () => {
    const dispatch = useDispatch();
    const hasfetched = useRef(false);
    const { user } = useSelector((store) => store.auth);

    const role = user?.role.toLowerCase();
    const isAdmin = role === 'admin';

    useEffect(() => {
        if (hasfetched.current) return;
        hasfetched.current = true;
        if (!user) return;

        const fetchImages = async () => {
            try {
                let response = await axios.get(`${import.meta.env.VITE_IMAGE_ENDPOINT}/get/user/${user._id}`,{ withCredentials: true });

                if (response?.data?.success) {
                    dispatch(setImages(response?.data?.images))
                    // console.log(response.data.images, "Fetched own images");
                }

            } catch (error) {
                console.log(error)
                toast.error(error.response?.data?.message);
            }
        };
        fetchImages();
    }, [user, isAdmin]);
}

export default useGetOwnIMages