import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useCallback } from "react";
import { deleteAlbum, renameAlbum } from "../../redux/albumSlice";
import { useDispatch, useSelector } from "react-redux";
import useGetOwnIMages from '../../hooks/useGetOwnIMages';
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, EllipsisVertical, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


const AlbumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { albums } = useSelector((store) => store.album);
    const { images } = useSelector((store) => store.image);
    useGetOwnIMages();

    const album = albums.find((a) => a?._id === id);

    const [albumName, setAlbumName] = useState(album?.name);
    const [isEditing, setIsEditing] = useState(false);

    if (!album) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <ArrowLeft />
                <h2 className="text-xl font-semibold">
                    Album not found
                </h2>
            </div>
        );
    }

    const saveName = async () => {
        if (!albumName.trim()) {
            setAlbumName(album.name);
            setIsEditing(false);
            return;
        }

        if (albumName.trim() === album.name) {
            setIsEditing(false);
            return;
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_ALBUM_ENDPOINT}/rename/${album._id}`,
                { name: albumName.trim() },
                { withCredentials: true }
            );

            if (response.data.success) {
                dispatch(renameAlbum({ id: album._id, name: albumName.trim() }));
                toast.success("Album renamed successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            setAlbumName(album.name);
        } finally {
            setIsEditing(false);
        }
    };


    const handleShareLinkCopy = useCallback(async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error("Clipboard API not supported");
            }

            const response = await axios.get(`${import.meta.env.VITE_ALBUM_ENDPOINT}/sharable-link/${album._id}`, { withCredentials: true });

            if (response.data.success) {
                await navigator.clipboard.writeText(response.data.sharableLink);
            }
            toast.success("Album link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy album link");
        }
    }, [album._id]);

    const handleDeleteAlbum = async () => {
        if (!window.confirm("Are you sure you want to delete this album? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_ALBUM_ENDPOINT}/delete/${album._id}`,{ withCredentials: true });

            if (response.data.success) {
                dispatch(deleteAlbum(album._id));
                toast.success("Album deleted successfully");
                navigate('/albums');
            }
        } catch (error) {
            console.error(error.response?.data);
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Cover */}
            <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden" >
                <img src={album?.coverImage} alt={album?.name} className="h-full w-full object-cover" />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-6 left-3.5 top-5 md:left-5 text-white">
                    <ArrowLeft className=" cursor-pointer" strokeWidth={3} onClick={() => navigate('/albums')} />
                </div>

                <div className="absolute top-5 right-12 md:right-16 text-white z-50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Share2 className="cursor-pointer" onClick={handleShareLinkCopy} />
                        </DropdownMenuTrigger>

                        {/* <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleShareLinkCopy}>
                                Share album
                            </DropdownMenuItem>
                        </DropdownMenuContent> */}
                    </DropdownMenu>
                </div>


                <div className="absolute top-5 right-3 md:right-5 text-white">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button type="button">
                                <EllipsisVertical className="cursor-pointer" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleShareLinkCopy}>
                                Share album
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-500" onClick={handleDeleteAlbum}>
                                Delete album
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 text-white">
                    {isEditing ?
                        (
                            <input type="text" autoFocus value={albumName} onChange={(e) => setAlbumName(e.target.value)} onBlur={saveName}
                                className="bg-transparent text-3xl md:text-5xl font-bold outline-none border-b border-blue-500 w-full"
                                onKeyDown={(e) => { if (e.key === "Enter") { saveName() } }}
                            />
                        ) : (
                            <h1 className="text-3xl md:text-5xl font-bold" onClick={() => setIsEditing(true)}>{albumName}</h1>
                        )
                    }

                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        {album?.images?.length === 0 ? "No items" : album?.images?.length === 1 ? "1 item" : `${album?.images?.length} items`}
                    </p>
                </div>
            </div>

            {/* Info */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="rounded-2xl border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold">Description</h2>

                    <p className="mt-2 text-gray-600">
                        {album?.description || "No description added."}
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-gray-500">Photos</p>
                        <p className="text-2xl font-bold">{album?.images?.length}</p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-gray-500">Album ID</p>
                        <p className="truncate text-sm font-medium">{album?._id}</p>
                    </div>
                </div>

                {/* Images */}
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold">Photos</h2>

                    {album?.images?.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-10 text-gray-500">
                            No photos in this album yet.
                            {/* <ImageUpload /> */}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {album.images.map((image, index) => (
                                <div key={index} className="overflow-hidden rounded-xl" >
                                    <img src={album?.images?.[index]?.url} alt={`Photo ${index + 1}`} className="aspect-square w-full object-cover transition duration-300 hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumDetails;