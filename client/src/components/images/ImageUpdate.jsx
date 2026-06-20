import axios from 'axios';
import { toast } from 'sonner';
import { ImagePlus } from "lucide-react";
import { useEffect, useState } from 'react'
import { Input } from "../../components/ui/input"
import { Button } from '../../components/ui/button';
import { updateImages } from '../../redux/ImageSlice';
import { useDispatch, useSelector } from 'react-redux';
import imageCompression from 'browser-image-compression';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, FieldDescription, FieldLabel } from "../../components/ui/field"

const ImageUpdate = () => {
    useEffect(() => {
        document.title = "Update Image"
    }, []);

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const { images } = useSelector((store) => store.image);

    const [input, setInput] = useState({
        id: "",
        image: images.map((img) => img._id === id ? img.url : img.url).find((url) => url !== null),
        title: "",
        tags: ""
    });

    useEffect(() => {
        const image = images.find((img) => img._id === id);
        if (image) {
            setInput({
                id: image._id,
                image: image.url, // set existing image URL for preview
                title: image.title,
                tags: image.tags ? image.tags.join(", ") : "",
            })
        }
    }, [images])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setInput((prev) => ({ ...prev, image: file }));
        }
    };

    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     try {
    //         setLoading(true);
    //         const formData = new FormData();
    //         formData.append("title", input.title);
    //         formData.append("tags", input.tags);
    //         if (input.image instanceof File) {
    //             formData.append("image", input.image);
    //         }

    //         const response = await axios.put(`${import.meta.env.VITE_IMAGE_ENDPOINT}/update/${id}`, formData, { withCredentials: true });

    //         if (response.data.success) {
    //             dispatch(updateImages({ id, updatedImage: response.data.image }));
    //             console.log(response.data.message);
    //             navigate('/images');
    //             toast.success(response.data.message);
    //         }

    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data?.message);

    //     } finally {
    //         setLoading(false);
    //     }
    // }



    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", input.title);
            formData.append("tags", input.tags);

            // Compress only if new image selected
            if (input.image instanceof File) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.9
                };

                const compressedFile = await imageCompression(input.image,options);
                console.log("Original Size:", (input.image.size / 1024 / 1024).toFixed(2), "MB");
                console.log("Compressed Size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
                formData.append("image", compressedFile);
            }

            const response = await axios.put(`${import.meta.env.VITE_IMAGE_ENDPOINT}/update/${id}`, formData, { withCredentials: true });

            if (response.data.success) {
                dispatch(updateImages({ id, updatedImage: response.data.image }));
                toast.success(response.data.message);
                navigate('/images');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center pt-1'>
            <form className='flex flex-col p-6 w-full sm:w-full overflow-y-hidden' onSubmit={submitHandler}>
                <div className='mx-auto w-full max-w-full mb-4'>
                    <label htmlFor="title" className='block text-gray-700 font-medium mb-2'>
                        Title
                    </label>
                    <input type="text" id="title" name="title" value={input.title} onChange={handleChange} className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                <div className='mx-auto w-full max-w-full mb-6'>
                    <label htmlFor="tags" className='block text-gray-700 font-medium mb-2'>
                        Tags
                    </label>
                    <input type="text" id="tags" name="tags" value={input.tags} onChange={handleChange} className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                <div className='mb-4'>
                    <p htmlFor="picture">Choose image for upload</p>
                    <Field className="">
                        {/* <FieldLabel htmlFor="picture">
                            Choose image for upload
                        </FieldLabel> */}

                        <label htmlFor="picture" className="flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-md cursor-pointer transition hover:bg-muted/40 hover:border-primary">
                            <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground" />

                            <p className="text-sm font-medium">Click to upload image</p>

                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>

                            {fileName && (
                                <p className="mt-4 text-sm text-primary font-medium">
                                    {fileName}
                                </p>
                            )}
                        </label>

                        <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                        <FieldDescription>
                            Select a picture to upload.
                        </FieldDescription>
                    </Field>
                </div>

                <Button variant="success" type="submit" disabled={loading} className='hover:bg-blue-700 text-white font-bold py-5 px-4 rounded-md disabled:opacity-50'>
                    {loading ? 'Updating...' : 'Update Image'}
                </Button>
            </form>
        </div>
    )
}

export default ImageUpdate