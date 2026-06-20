// import axios from 'axios';
// import { toast } from 'sonner';
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from '../../components/ui/button'
// import { deleteImages, setImages } from '../../redux/ImageSlice';
// import { Download, Minus, Pencil, Plus, Trash } from 'lucide-react';
// import Masonry from "react-masonry-css";

// const ImageTable = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { user } = useSelector((store) => store.auth);
//     const { images, searchImagebyname } = useSelector((store) => store.image);
//     const [filterImages, setFilterImages] = useState(images);
//     const [expandedDates, setExpandedDates] = useState({});

//     const breakpointColumnsObj = {
//         default: 4,
//         1280: 3,
//         768: 2,
//         500: 1
//     };

//     const isUser = user?.role === "user";

//     useEffect(() => {
//         if (!images) return;

//         const filteredImages = images.filter((image) => {
//             if (!searchImagebyname) {
//                 return true;
//             }
//             return image?.title?.toLowerCase().includes(searchImagebyname?.toLowerCase());
//         })
//         setFilterImages(filteredImages);
//     }, [images, searchImagebyname]);

//     const toggleDate = (date) => {
//         setExpandedDates((prev) => ({
//             ...prev,
//             [date]: !prev[date],
//         }));
//     }

//     const groupedByDate = filterImages.reduce((acc, image) => {
//         const dateKey = new Date(image.createdAt).toLocaleDateString();
//         if (!acc[dateKey]) {
//             acc[dateKey] = [];
//         }
//         acc[dateKey].push(image);
//         return acc;
//     }, {});

//     const refreshPage = async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_IMAGE_ENDPOINT}/get/user/${user._id}`, { withCredentials: true });
//             if (response.data.success) {
//                 dispatch(setImages(response.data.images));
//                 console.log(response.data.message);
//                 toast.success(response?.data?.message);
//             }

//         } catch (error) {
//             toast.error(error.response?.data?.message);
//         }
//     }

//     const updateImagesHandler = (id) => {
//         console.log('update button clicked for image with id:', id);
//         // Add update logic here
//         navigate(`/update-images/${id}`);
//     }

//     const deleteImageHandler = async (id) => {
//         // Add delete logic directly here
//         try {
//             const response = await axios.delete(`${import.meta.env.VITE_IMAGE_ENDPOINT}/delete/${id}`, { withCredentials: true });
//             if (response.data.success) {
//                 console.log('Image deleted successfully');
//                 dispatch(deleteImages({ _id: id }));
//                 await refreshPage();
//                 toast.success('Image deleted successfully');
//                 alert('Image deleted successfully');
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message);
//         }

//     }

//     return (
//         <div className="space-y-4">
//             {Object.entries(groupedByDate).map(([date, images]) => (
//                 <div key={date} className="space-y-4 pt-1">
//                     {/* Date Header */}
//                     <Button onClick={() => toggleDate(date)} className="flex items-center gap-2 text-sm font-semibold bg-transparent border-none" variant="outline">
//                         <span className='text-xs font-semibold text-gray-700'>{expandedDates[date] ? <Minus size={10} /> : <Plus size={10} />}</span>
//                         <span className='text-xs font-semibold text-gray-700'>{new Date(date).toLocaleDateString('en-GB')}</span>
//                     </Button>

//                     {/* Image Grid */}
//                     {expandedDates[date] && (
//                         <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-6" columnClassName="space-y-6">
//                             {images.map((image) => (
//                                 <div key={image._id} className="group relative overflow-hidden rounded-md bg-black cursor-pointer">
//                                     <img src={image.url.replace("/upload/", "/upload/w_800,q_auto,f_auto/")} alt={image.title} loading="lazy"
//                                         className="w-full h-80 md:h-95 xl:h-105 object-cover transition-all duration-700 group-hover:scale-none hover:border-none" />

//                                     <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

//                                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
//                                         <Button variant='outline' className="w-10 h-10 rounded-full bg-white/15 border-0 backdrop-blur-xs flex items-center justify-center text-white hover:bg-white/25"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 updateImagesHandler(image._id)
//                                             }}>
//                                             <Pencil size={18} />
//                                         </Button>

//                                         <Button variant='outline' className="w-10 h-10 rounded-full bg-red-400/70 border-0 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 deleteImageHandler(image._id)
//                                             }}>
//                                             <Trash size={18} />
//                                         </Button>

//                                         <Button variant='outline' className="w-10 h-10 rounded-full bg-white/15 border-0 backdrop-blur-md flex items-center justify-center text-white hover:backdrop-blur-xs hover:bg-transparent"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 window.open(image.url, '_blank');
//                                             }}>
//                                             <Download size={18} />
//                                         </Button>
//                                     </div>

//                                     <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
//                                         <h2 className="text-white text-xl font-bold capitalize">{image.title}</h2>
//                                         <p className="text-gray-300 text-sm mt-1 capitalize">{image.tags.join(", ")}</p>

//                                         <div className="flex items-center justify-between mt-4">
//                                             <span className="text-white/80 text-sm capitalize">{image.uploadedBy?.name}</span>
//                                             <span className="px-3 py-1 rounded-full bg-white/20 capitalize backdrop-blur-md text-white text-xs">{image.visibility}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </Masonry>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default ImageTable


import axios from "axios";
import { toast } from "sonner";
import Masonry from "react-masonry-css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Download, Pencil, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteImages, setImages } from "../../redux/ImageSlice";

const ImageTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.auth);
    const { images, searchImagebyname } = useSelector((store) => store.image);
    const [filterImages, setFilterImages] = useState([]);

    const breakpointColumnsObj = {
        default: 5,
        1536: 4,
        1280: 3,
        768: 2,
        500: 1,
    };

    useEffect(() => {
        if (!images) return;

        const filtered = images.filter((image) => {
            if (!searchImagebyname) return true;
            return image?.title?.toLowerCase().includes(searchImagebyname?.toLowerCase());
        });

        setFilterImages(filtered);
    }, [images, searchImagebyname]);

    const refreshPage = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_IMAGE_ENDPOINT}/get/user/${user._id}`, { withCredentials: true });
            if (response.data.success) {
                dispatch(setImages(response.data.images));
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const updateImagesHandler = (id) => {
        navigate(`/update-images/${id}`);
    };

    const deleteImageHandler = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_IMAGE_ENDPOINT}/delete/${id}`, { withCredentials: true });

            if (response.data.success) {
                dispatch(deleteImages({ _id: id }));
                await refreshPage();
                toast.success("Image deleted successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="p-3">
            <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-4" columnClassName="space-y-4">
                {filterImages.map((image) => (
                    <div key={image?._id} className="group relative overflow-hidden rounded-xl bg-neutral-900">
                        <img src={image?.url?.replace("/upload/", "/upload/w_1000,q_auto,f_auto/")} alt={image?.title} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-105 pointer-events-none" />
                        {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300" /> */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                        <div className="absolute top-3 z-20 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
                            <Button size="icon" variant="outline" className="rounded-full border-0 bg-white/20 backdrop-blur-md text-white hover:bg-white/30" onClick={() => updateImagesHandler(image._id)}>
                                <Pencil size={16} />
                            </Button>

                            <Button size="icon" variant="outline" className="rounded-full border-0 bg-red-500/80 text-white hover:bg-red-600" onClick={() => deleteImageHandler(image._id)}>
                                <Trash size={16} />
                            </Button>


                            <Button variant='outline' className="rounded-full bg-white/15 border-0 backdrop-blur-md flex items-center justify-center text-white hover:backdrop-blur-xs hover:bg-bg-white/25"
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log("download clicled")
                                    window.open(image?.url, '_blank');
                                }}>
                                <Download size={18} />
                            </Button>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 translate-y-full group-hover:translate-y-0 transition duration-300">
                            <h2 className="text-white font-semibold text-lg capitalize">{image?.title}</h2>

                            <div className="flex items-center justify-between mt-4">
                                <p className="text-gray-300 text-sm mt-1 capitalize">{image?.tags?.join(", ")}</p>
                                <p className="text-gray-300 text-sm mt-1 capitalize">{image?.album?.name}</p>
                            </div>                            

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-white/80 text-sm capitalize">{image?.uploadedBy?.name}</span>
                                <span className="px-3 py-1 rounded-full bg-white/20 capitalize backdrop-blur-md text-white text-xs">{image?.visibility}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default ImageTable;