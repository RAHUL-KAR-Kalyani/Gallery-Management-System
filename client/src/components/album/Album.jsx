import AlbumTable from './AlbumTable';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useGetOwnAlbum from '../../hooks/useGetOwnAlbum';
import { Plus, SquarePlus, Search, Check, RefreshCw } from "lucide-react";

const Album = () => {
    useEffect(() => {
        document.title = "Album"
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { albums } = useSelector((store) => store.album);
    console.log(albums);
    const [message, setMessage] = useState('');
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 2000);
        setMessage('Refresh Button clicked!');
        // console.log("test", useGetOwnAlbum());
        console.log(message)
    }


    useGetOwnAlbum();

    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    return (
        <div className="min-h-auto bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h1 className="text-4xl font-normal">Albums</h1>

                <div className='flex items-center justify-between gap-5'>
                    <Button variant='outline' className="flex items-center gap-2 text-gray-700 hover:text-black" onClick={() => navigate('/create-album')}>
                        <Plus size={18} />
                        {/* <SquarePlus size={18} /> */}
                        <span>Create album</span>
                    </Button>
                    <Button variant='outline' className="flex items-center gap-2 text-gray-700 hover:text-black" onClick={() => handleRefresh()}>
                        <RefreshCw size={18} className={`transition-transform ${spinning ? "animate-spin" : ""}`} />
                        {spinning ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </div>

            </div>

            {/* Filters */}
            <div className="px-4 py-8 flex flex-wrap gap-3">
                <Button variant='outline' className="flex items-center gap-2 rounded-xl bg-sky-100 px-5 py-2 text-gray-800">
                    <Check size={16} />
                    All
                </Button>

                <Button variant='outline' className="rounded-xl border border-gray-400 px-5 py-2 text-gray-700">
                    My albums
                </Button>

                <Button variant='outline' className="rounded-xl border border-gray-400 px-5 py-2 text-gray-700">
                    Shared with me
                </Button>

                <Button variant='outline' className="rounded-xl border border-gray-400 p-2">
                    <Search size={18} />
                </Button>
            </div>

            {/* Album Grid */}
            <AlbumTable />
        </div>
    )
}

export default Album