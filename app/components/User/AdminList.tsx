"use client";
import AdminCard from './AdminCard';

type AdminListProps = {
    admins: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        fk_imagesid_images: number;
    }[];
    onAdd: (admin_id: number, project_id: number) => void;
    onRemove: (admin_id: number, project_id: number) => void;
    project_id: number;
    searchQuery: string;
};

const AdminList: React.FC<AdminListProps> = ({ admins, onAdd, onRemove, project_id, searchQuery }) => {
    return (
        <>
            {admins.map((admin) => (
                <AdminCard
                    key={admin.id}
                    admin={admin}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    project_id={project_id}
                    searchQuery={searchQuery}
                />
            ))}
        </>
    );
};

export default AdminList;