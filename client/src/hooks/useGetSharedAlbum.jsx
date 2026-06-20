import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSharedAlbum } from "../redux/albumSlice";

const useGetSharedAlbum = (token) => {
	const dispatch = useDispatch();
	const { sharedAlbum } = useSelector((store) => store.album);

	useEffect(() => {
		if (!token) return;

		const fetchSharedAlbum = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_ALBUM_ENDPOINT}/shared/${token}`);

				console.log("full response:", response);
				console.log("response.data:", response.data);

				if (response?.data?.success) {
					console.log("dispatching:", response.data.album);
					dispatch(setSharedAlbum(response.data.album));
				} else {
					console.log("Shared album not fetched successfully");
				}
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || "Failed to fetch album");
			}
		};

		fetchSharedAlbum();
	}, [token, dispatch]);
};

export default useGetSharedAlbum;