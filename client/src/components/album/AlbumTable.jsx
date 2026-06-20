import AlbumCard from "./AlbumCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const AlbumTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { albums, searchAlbumbyname } = useSelector((store) => store.album);
    const [filteredAlbum, setFilteredAlbum] = useState([]);

    useEffect(() => {
        if (!albums) return;
        
        const filtered = albums.filter((item) => {
            if (!searchAlbumbyname) return true;
            return item.title.toLowerCase().includes(searchAlbumbyname.toLowerCase());
        });
        // console.log(filtered, 'filtered');

        setFilteredAlbum(filtered);
    }, [albums, searchAlbumbyname]);
    // console.log(filteredAlbum, 'filteredAlbums');

    // const moveToDetails=(id)=>{
    //     navigate(`/albums/${id}`);
    //     console.log("first")
    // }

    return (
        <div className="px-4 pb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" >
                {filteredAlbum.map((album) => (
                    <AlbumCard key={album._id} album={album}/>
                ))}
            </div>
        </div>
    )
}

export default AlbumTable