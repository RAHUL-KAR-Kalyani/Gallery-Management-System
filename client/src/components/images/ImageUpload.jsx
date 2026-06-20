import axios from 'axios';
import { toast } from 'sonner';
import { ImagePlus } from "lucide-react";
import { useEffect, useState } from 'react'
import { Input } from "../../components/ui/input"
import { Button } from '../../components/ui/button';
import { uploadImages } from '../../redux/ImageSlice';
import { useDispatch, useSelector } from 'react-redux';
import useGetOwnAlbum from '../../hooks/useGetOwnAlbum';
import imageCompression from 'browser-image-compression';
import { Field, FieldDescription } from "../../components/ui/field"

const ImageUpload = () => {
	useEffect(() => {
		document.title = "Image Upload"
	}, []);
	useGetOwnAlbum();

	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [fileName, setFileName] = useState("");
	const { albums } = useSelector((store) => store.album);


	const [input, setInput] = useState({
		image: null,
		title: '',
		tags: '',
		album: ''
	})

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			setInput((prev) => ({ ...prev, image: file }));
		}
	};

	const handleChange = (e) => {
		// console.log(e.target.name, e.target.value);
		const { name, value } = e.target;
		setInput({ ...input, [name]: value });
	}

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	setLoading(true);
	// 	console.log(input);
	// 	try {
	// 		const formData = new FormData();
	// 		formData.append("image", input.image);
	// 		formData.append("title", input.title);
	// 		formData.append("tags", input.tags);

	// 		// Implement image upload logic here

	// 		const response = await axios.post(`http://localhost:8000/image/upload`, formData, { withCredentials: true });
	// 		if (response.data.success) {
	// 			dispatch(uploadImages([response.data.image]));
	// 			toast.success("Image uploaded successfully!");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		toast.error(error.response?.data?.message || "Failed to upload image. Please try again.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!input.image) {
			toast.error("Please select an image");
			return;
		}

		try {
			setLoading(true);
			// Compression options
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
				initialQuality: 0.9
			};

			// Compress image
			const compressedFile = await imageCompression(input.image, options);

			console.log("Original Size:", (input.image.size / 1024 / 1024).toFixed(2), "MB");
			console.log("Compressed Size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");

			const formData = new FormData();
			formData.append("image", compressedFile);
			formData.append("title", input.title);
			formData.append("tags", input.tags);

			// optional
			// formData.append("album", input.album);
			if (input.album?.trim()) {
				formData.append("album", input.album);
			}

			const response = await axios.post(`${import.meta.env.VITE_IMAGE_ENDPOINT}/upload`, formData, { withCredentials: true });
			console.log(response.data, "response from server");
			if (response.data.success) {
				dispatch(uploadImages([response.data.image]));
				console.log(response.data.image);
				toast.success("Image uploaded successfully!");
				// Reset form
				setInput({ image: null, title: '', tags: '', album: '' });
				setFileName('');
			}

		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex justify-center pt-1'>
			<form className='flex flex-col p-6 w-full sm:w-full overflow-y-hidden' onSubmit={handleSubmit}>
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

				<div className='mx-auto w-full max-w-full mb-6'>
					<label htmlFor="album" className='block text-gray-700 font-medium mb-2'>
						Album
					</label>
					<select id="album" name="album" value={input.album} onChange={handleChange} className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option value="">Select Album (optional)</option>
						{albums.map((album) => (
							<option key={album._id} value={album._id}>
								{album.title} {album.name}
							</option>
						))}
					</select>					
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

				<Button variant="success" type="submit" disabled={loading} className='text-white font-bold py-5 px-4 rounded-md disabled:opacity-50'>
					{loading ? 'Uploading...' : 'Upload Image'}
				</Button>
			</form>
		</div>
	);
}

export default ImageUpload