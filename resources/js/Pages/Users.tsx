import ConfirmAlert from '@/components/confirm-alert';
import AddUserSheet from '@/components/ui/add-user-sheet';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ColumnHeader from '@/components/ui/column-header';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import EditUserSheet from '@/components/ui/edit-user-sheet';
import { cn, getAvatar } from '@/lib/utils';
import { User } from '@/types'
import { router } from '@inertiajs/react';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, LockKeyhole, LockKeyholeOpen, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import {Toaster, toast} from 'react-hot-toast';

type Props = {
    users: User[];
}

type AlertType = "delete" | "activate" | "block";

const Users = ({ users }: Props) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>();
    const [selectedUser, setSelectedUser] = useState<User>();
    const [openAddUserSheet, setOpenAddUserSheet] = useState(false);
    const [openEditUserSheet, setOpenEditUserSheet] = useState(false);

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            id: "avatar",
            header: ({ column }) => <ColumnHeader column={column} title="Avatar" />,
            enableSorting: false,
            cell: ({ row }) => {
                const user = row.original;
                return <Avatar> 
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getAvatar(user.name)}</AvatarFallback>
                </Avatar>
            }
        },
        {
            header: ({ column }) => (
                <ColumnHeader column={column} title="Full name" />
            ),
            accessorKey: "name",
        },
        {
            header: ({ column }) => (
                <ColumnHeader column={column} title="Email" />
            ),
            accessorKey: "email",
        },
        {
            id: "actions",
            header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
            enableSorting: false,
            cell: ({row}) => {
                const user = row.original;

                return (
                
                <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open Menu</span>
                            <MoreHorizontal className='h-4 w-4'/>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() =>{
                                setSelectedUser(user);
                                setOpenEditUserSheet(true);
                            }}>
                                <Edit />
                            </DropdownMenuItem>                        
                            <DropdownMenuItem onClick={() => presentAlert(user, "delete")}>
                                <Trash2 /> Delete
                            </DropdownMenuItem>                        
                            <DropdownMenuItem
                                onClick={() => presentAlert(user, user.is_active ? "block" : "activate")}
                            >
                                {user.is_active ? <LockKeyhole /> : <LockKeyholeOpen />}
                                {user.is_active ? "Block" : "Activate"}
                            </DropdownMenuItem>                        
                     </DropdownMenuContent>
                </DropdownMenu>
    )}
        },
        
    ], [])

    const presentAlert = (user: User, type: AlertType) => {
        setSelectedUser(user);
        setAlertType(type);
        setOpenAlert(true);
    }
    
    const handleDelete = () => {
        router.delete(route("users.destroy", selectedUser?.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("User has been deleted successfully");
                setSelectedUser(undefined);
            },
        });
    };

    const handleUpdateStatus = () => {
        router.post(
            route("users.status", selectedUser?.id),
            { status: alertType},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("User has been blocked successfully");
                    setSelectedUser(undefined);
                },
            }
        );
    };

    return (
    <div className='max-w-7xl mx-auto mt-10'>
        <div className='flex justify-between mb-5 items-end'>
            <div>
                <h1 className='text-3xl font-bold'>Users</h1>
                <p className='text-muted-foreground font-medium text-sm'>
                    User Accounts management with File Uploads
                </p>
            </div>
            <Button onClick={() => setOpenAddUserSheet(true)}>Create New</Button>
        </div>
        
        <DataTable columns={columns} data={users}/>

        <ConfirmAlert
            title={`Confirm ${alertType}`}
            message={`Are you sure you want to ${alertType}?`}
            open = {openAlert}
            onOpenChange={setOpenAlert}
            onConfirm={alertType === "delete" ? handleDelete : handleUpdateStatus}
        />

        <AddUserSheet
         open={openAddUserSheet}
         onOpenChange={setOpenAddUserSheet}
         />

        {selectedUser && openEditUserSheet && (
            <EditUserSheet 
                selected={selectedUser}
                open={openEditUserSheet} 
                onOpenChange={(openState) => {
                    setSelectedUser(undefined);
                    setOpenEditUserSheet(openState);
                }}
            
            />
            )}

        <Toaster />
    </div>
  )
}

export default Users