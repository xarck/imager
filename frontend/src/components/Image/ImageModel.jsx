import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Comment from './Comment';
import { CloseIcon, DeleteIcon } from '../../icons/icons';
import Like from './Like';
import { handleDeleteImage, handleDeleteComment } from '../../api/ImageAPI';
import { getUploader } from '../../api/UserAPI';

const ImageModel = ({ img, setModel, setUpdateUI }) => {
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);
    const [likes, setLikes] = useState(img.likes);
    const [uploader, setUploader] = useState('');

    useEffect(() => {
        getUploader(img.imgId, setUploader);
    }, [img.imgId, open]);


    useEffect(() => {
        open ? setModel(true) : setModel(false);
    }, [open, setModel]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="mx-auto transform overflow-hidden rounded-lg bg-white">

                                    <img className="h-full w-full object-center" src={img.url} loading="lazy" alt="pic" />

                                    <button type="button" className="bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 absolute top-0 right-0 outline-none"
                                        onClick={() => { setOpen(false); setModel(false) }}
                                        ref={cancelButtonRef}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <CloseIcon />
                                    </button>

                                    <div className='flex flex-col items-left mt-3 ml-3'>
                                        Uploaded By : {uploader}
                                    </div>

                                    <div className="p-4">

                                        <Like
                                            setLikes={setLikes}
                                            likes={likes}
                                            img={img}
                                        />

                                        <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
                                            {img.title}
                                        </h2>
                                        <p className="relative text-xl whitespace-nowrap truncate overflow-hidden pb-2">Comments</p>
                                        <hr className='pb-2' />
                                        {
                                            img.comments.map((comment) => {
                                                return (
                                                    <div key={comment} className="flex gap-3 space-y-1 pb-3">
                                                        <img src="https://www.pngmart.com/files/21/Admin-Profile-PNG-Clipart.png" className="rounded-full h-8 w-8" alt='profile pic' />
                                                        <span className="text-sm">{comment}</span>
                                                        <button onClick={(e) => handleDeleteComment(e, img.imgId, comment, setUpdateUI)} className='ml-auto'>
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>

                                <Comment imgId={img.imgId} setUpdateUI={setUpdateUI} />

                                <div className='flex flex-col items-center pb-4 pt-2'>
                                    <button className="flex px-3 py-2 bg-red-400 mr-1 text-white font-semibold rounded" onClick={(e) => handleDeleteImage(e, img, setModel, setOpen, setUpdateUI)}>
                                        <DeleteIcon />
                                        <span className="ml-1">Delete</span>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}

export default ImageModel;
