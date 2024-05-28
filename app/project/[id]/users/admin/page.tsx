"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import AdminList from "@/app/components/User/AdminList";
import { toast } from "sonner";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    fk_imagesid_images: number;
}

interface Project {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    repository: string;
    technologies: string;
    created_at: string;
    updated_at: string;
    star_count: number;
    contributor_count: number;
    codebase_visibility: string;
    fk_imagesid_images: number;

    logo: string;
    images: {
        image: {
            data: Buffer;
            contentType: string;
        }
    }
}

interface Controls {
    fk_usersid: number;
    fk_projectsid: number;
}

export default function EditProjectAdministrators({ params }: { params: { id: number } }) {

    const [searchInput, setSearchInput] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, any>>({});
    const projectId = params.id;

    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch(`/api/project/${projectId}`);
            if (response.ok) {
                const project = await response.json();
                setProject(project);
            }
        };

        const fetchUsers = async () => {
            const response = await fetch(`/api/user/all`);
            if (response.ok) {
                const users = await response.json();
                setAllUsers(users.users);
            }

        };

        const fetchAdmins = async () => {
            const response = await fetch(`/api/controls/${projectId}`);
            if (response.ok) {
                const controls = await response.json();
                const adminUsers: User[] = [];
                for (const control of controls) {
                    const userResponse = await fetch(`/api/user/${control.fk_usersid}`);
                    if (userResponse.ok) {
                        const user = await userResponse.json();
                        adminUsers.push(user);
                    }
                }
                setAdmins(adminUsers);
            }
        };

        fetchProject();
        fetchUsers();
        fetchAdmins();
    }, [projectId]);

    useEffect(() => {
        if (searchInput === '') {
            setFilteredUsers([]);
        } else {
            setFilteredUsers(allUsers.filter(allUsers => allUsers.email.includes(searchInput) || allUsers.first_name.includes(searchInput)));
        }
    }, [searchInput, allUsers]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleUserSelect = (userId: number) => {
        addAdmin(userId);
        setSearchInput('');
    };

    const addAdmin = async (adminId: number) => {
        const response = await fetch(`/api/controls/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: adminId }),
        });

        if (response.ok) {
            const userResponse = await fetch(`/api/user/${adminId}`);
            if (userResponse.ok) {
                const user = await userResponse.json();
                setAdmins([...admins, user]);
                toast.success("Naudotojas pridėtas");
            }
        }
    };

    const removeAdmin = async (adminId: number) => {
        if (admins.length === 1) {
            toast.error("Projektas turi turėti bent vieną administratorių");
            return;
        }

        if (!confirm("Ar tikrai norite pašalinti šį administratorių?")) return;

        const response = await fetch(`/api/controls/${projectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: adminId }),
        });

        if (response.ok) {
            setAdmins(admins.filter((admin) => admin.id !== adminId));
            toast.success("Naudotojas pašalintas");
        }
    };

    return (
        <div className="flex flex-col itmes-end pt-6 w-full max-w-5xl">
            <div className="relative mb-4">
                Pridėti naudotoją:
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" />
                <div className="absolute mt-2 w-full max-h-22 overflow-y-auto">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => handleUserSelect(user.id)}
                            className="cursor-pointer bg-blue-100 hover:bg-blue-200 rounded-lg p-1 max-w-md h-8 text-clip overflow-hidden"
                        >
                            {user.first_name} {user.last_name} ({user.email})
                        </div>// Show message if not a single user is found
                    ))}
                </div>
            </div>
            <div className="overflow-y-auto">
                {admins.length === 0 ?
                    <div>Šis projektas neturi administratorių</div>
                :
                    <AdminList
                        admins={admins}
                        onAdd={addAdmin}
                        onRemove={removeAdmin}
                        project_id={projectId}
                        searchQuery=""
                    />
                }
            </div>
        </div>
    );
};