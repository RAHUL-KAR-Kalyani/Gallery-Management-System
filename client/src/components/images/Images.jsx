import React, { useEffect, useState } from 'react'
import { Input } from "../ui/input";
import { Button } from '../ui/button';
import ImageTable from './ImageTable';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Image, RefreshCw } from 'lucide-react';
import useGetOwnIMages from '../../hooks/useGetOwnIMages';
import { setSearchImageByName } from '../../redux/ImageSlice';

const Images = () => {
    useEffect(() => {
        document.title = "Images"
    }, []);

    const { user } = useSelector((store) => store.auth);
    const { images } = useSelector((store) => store.image);
    const [message, setMessage] = useState('');
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 2000);
        setMessage('Refresh Button clicked!');
        // console.log(message)
    }

    useGetOwnIMages();

    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchImageByName(input));
    }, [input, dispatch]);



    return (
        <div className='min-w-full pt-1'>
            <div className="flex flex-col gap-6">

                {/* <div className="flex items-center gap-4">
                    <Input placeholder="Search By Name" className="w-md h-lg p-1 text-md! outline-none border-0 border-gray-200 rounded-none bg-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={(e) => setInput(e.target.value)} />

                    <Button variant="outline" className="w-auto h-10 rounded-none bg-slate-800 hover:bg-slate-600 text-white" onClick={() => navigate('/upload')}>
                        Upload Images
                    </Button>

                    <Button variant='outline' className='h-10 bg-slate-800 text-white rounded-none hover:bg-slate-600 flex items-center p-2 gap-3' onClick={() => handleRefresh()}>                        
                        <RefreshCw size={20} className={`transition-transform ${spinning ? "animate-spin" : ""}`} />
                        {spinning ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </div> */}



                <h1 className="text-4xl font-normal">Images</h1>
                <div className="flex items-center justify-between border-b px-4 py-3">

                    <Input placeholder="Search By Name" className="w-md h-lg p-1 text-md! outline-none border-0 border-gray-200 rounded-none bg-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={(e) => setInput(e.target.value)} />
                    <div className='flex items-center justify-between gap-5'>
                        <Button variant='outline' className="flex items-center gap-2 text-gray-700 hover:text-black" onClick={() => navigate('/upload')}>
                            <Image size={18} />
                            <span>Upload Images</span>
                        </Button>
                        <Button variant='outline' className="flex items-center gap-2 text-gray-700 hover:text-black" onClick={() => handleRefresh()}>
                            <RefreshCw size={18} className={`transition-transform ${spinning ? "animate-spin" : ""}`} />
                            {spinning ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                </div>
            </div>
            <ImageTable className="p-6" />
        </div>
    );
}

export default Images
