import axios from "axios";
import { toast } from "sonner";
import { Button } from '../ui/button';
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteAlbum, renameAlbum } from "../../redux/albumSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const AlbumCard = ({ album }) => {
    const dispatch = useDispatch();
    const [openMenu, setOpenMenu] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [openRename, setOpenRename] = useState(false);

    const [albumName, setAlbumName] = useState(album.name);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const moveToDetails = (id) => {
        navigate(`/albums/${id}`);
        console.log("first")
    }
    const onOpenMenu = (e) => {
        e.stopPropagation();
        setOpenMenu(prev => !prev);
    }

    const handleRename = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_ALBUM_ENDPOINT}/rename/${album._id}`, { name: albumName.trim() }, { withCredentials: true });

            if (response.data.success) {
                setOpenRename(false);
                // Refresh albums
                dispatch(renameAlbum({ id: album._id, name: albumName.trim() }));
                // Update local UI immediately
                setAlbumName(response.data.album.name);
                toast.success("Album renamed successfully");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
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
        if (!confirm("Are you sure you want to delete this album? This action cannot be undone.")) {
            return;
        }
        try {
            const response = await axios.delete(`${import.meta.env.VITE_ALBUM_ENDPOINT}/delete/${album._id}`, { withCredentials: true });

            if (response.data.success) {
                // Handle successful deletion (e.g., update UI, show toast)
                dispatch(deleteAlbum(album._id));
                toast.success("Album deleted successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    }

    return (
        <div className="cursor-pointer">
            <div className="relative overflow-hidden rounded-xl group">
                <img src={album?.coverImage} alt={album?.name} className="aspect-square w-full object-cover" onClick={() => moveToDetails(album._id)} />

                {/* 3-dot button */}
                {/* <Button variant='transparent' className="cursor-pointer absolute top-2 right-2 rounded-full p-1 text-white" onClick={(e) => onOpenMenu(e)}>
                    <MoreVertical size={18} />
                </Button> */}

                {/* Dropdown */}
                {/* {openMenu && (
                    <div className="cursor-pointer absolute right-2 top-12 z-20 w-32 overflow-hidden rounded-lg bg-white shadow-lg border">
                        <Button variant="ghost" className="w-32 px-4 py-3 text-left hover:bg-gray-100"
                            onClick={() => {
                                setAlbumName(album.name);
                                setOpenRename(true);
                            }}
                        >
                            Rename album
                        </Button>

                        <Button variant="ghost" className="w-32 px-4 py-3 text-left hover:bg-gray-100">
                            Share album
                        </Button>

                        <Button variant="ghost" className="w-32 px-4 py-3 text-left text-red-500 hover:bg-red-50">
                            Delete album
                        </Button>
                    </div>
                )} */}
                <div className="absolute top-3 right-3 md:right-4 text-gray-800 z-50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setAlbumName(album.name); setOpenRename(true) }}>
                                Rename album
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShareLinkCopy}>
                                Share album
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteAlbum} className="text-red-500">
                                Delete album
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>



            <h3 className="mt-2 text-lg font-medium">{album?.name}</h3>

            <p className="text-sm text-gray-500">
                {album?.images?.length === 0 ? "No items" : album?.images?.length === 1 ? "1 item" : `${album?.images?.length} items`}
            </p>

            <Dialog open={openRename} onOpenChange={setOpenRename}>
                <DialogContent className="max-w-xl">
                    <DialogTitle>Rename album</DialogTitle>
                    <DialogDescription>
                        Enter a new name for your album.
                    </DialogDescription>

                    <div className="flex gap-6">
                        <img src={album.coverImage} alt={album.name} className="w-32 h-32 rounded-lg object-cover" />

                        <div className="flex-1">
                            <input type="text" value={albumName} className="w-full border-b-2 outline-none py-2" onChange={(e) => setAlbumName(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="ghost" onClick={() => setOpenRename(false)} >
                            Cancel
                        </Button>

                        <Button variant="ghost" onClick={handleRename} disabled={!albumName.trim()} className="text-blue-600 disabled:text-gray-400" >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AlbumCard;