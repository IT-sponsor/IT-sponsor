"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import UserDefault from '@/public/assets/defaultUser.jpg';

type AdminCardProps = {
    admin: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        fk_imagesid_images: number;
    };
    onAdd: (admin_id: number, project_id: number) => void;
    onRemove: (admin_id: number, project_id: number) => void;
    project_id: number;
    searchQuery: string;
};

const AdminCard: React.FC<AdminCardProps> = ({ admin, onAdd, onRemove, project_id, searchQuery }) => {
    const { id, first_name, last_name, fk_imagesid_images: image_id } = admin;
    const fullName = `${first_name} ${last_name}`;
    const profileUrl = `/profile/${admin.id}`;
    const [image, setImage] = useState({} as string);

    useEffect(() => {
        console.log(image_id);
        fetch(`/api/image/${image_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.image) {
                    const imageData = data.image.data;
                    const base64String = Buffer.from(imageData).toString('base64');
                    setImage(`data:image/png;base64,${base64String}`);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [image_id]);


    return (
        <div key={admin.id} className="flex-grow px-4 py-2 mt-2 w-full rounded-xl border-2 border-gray-100 bg-white">
            <div className="flex items-center justify-between">
                <Link href={`/profile/${admin.id}`}>
                    <div className="flex items-center space-x-4 shrink-0 hover:bg-green-100 rounded-lg pr-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            {image ? (
                                <img alt={fullName} width={100} height={100} className="rounded-full" src={image} />
                            ) : (
                                <img alt={fullName} width={100} height={100} className="rounded-full" src={UserDefault.src} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-lg hover:bg-green-100 rounded-lg px-1">{fullName}</p>
                        </div>
                    </div>
                </Link>
                <div className="flex items-center overflow-y-auto ">
                    <button onClick={() => onRemove(id, project_id)} className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Panaikinti
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCard;