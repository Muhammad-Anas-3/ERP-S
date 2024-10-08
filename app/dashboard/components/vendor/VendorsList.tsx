import React, { useEffect, useState } from 'react'
import moment from 'moment';
//ICONS
import { RiDeleteBin6Line, RiEyeLine, RiEdit2Line } from "react-icons/ri";
import Image from 'next/image';
// SHADCN.UI
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TiBriefcase } from 'react-icons/ti';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VendorsList = () => {
    type Vendor = {
        id: number;
        imageUrl: string;
        name: string;
        contractvalue: string;
        vendorCategory: string;
        email: string;
        date: string;
        type: string;
        address: string;
        note: string;
    };

    const [vendors, setVendor] = useState<Vendor[] | null>()
    const [reload, setReload] = useState(false)

    //     EDIT VENDOR useStates
    const [editName, setEditName] = React.useState<string>("")
    const [editEmail, setEditEmail] = React.useState<string>("")
    const [editValue, setEditValue] = React.useState<string>("")
    const [editCategory, setEditCategory] = React.useState<string>("")
    const [editType, setEditType] = React.useState<string>("")
    const [editAddress, setEditAddress] = React.useState<string>("")
    const [editNote, setEditNote] = React.useState<string>("")

    //  EDIT FUNCTION
    const editData = async (editId: number) => {
        try {
            const response = await fetch("/api/vendor", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editId,
                    name: editName,
                    email: editEmail,
                    contractvalue: editValue,
                    vendorCategory: editCategory,
                    type: editType,
                    address: editAddress,
                    note: editNote
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to update vendor: ${response.statusText}`);
            } else {
                setVendor(null)
                setReload(!reload);
            }

        } catch (error) {
            console.error(error)
        }
    }

    // FILL EDIT INPUT FIELDS
    const fillData = (user: any) => {
        setEditName(user.name);
        setEditEmail(user.email);
        setEditValue(user.contractvalue);
        setEditCategory(user.vendorCategory);
        setEditType(user.type);
        setEditAddress(user.address);
        setEditNote(user.note)
    }

    //     DELETE FUNCTION
    const deleteVendor = async (id: number) => {
        try {
            const response = await fetch('/api/vendor', {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                setVendor(null)
                fetchVendors()
            }
        } catch (error) {
            console.error("An error occurred while deleting the vendor:", error);
        }
    };

    // FETCH VENDORS FUNCTION
    const fetchVendors = async () => {
        const response = await fetch("/api/vendor");
        const data = await response.json();
        setVendor(await data.vendors);
    };
    useEffect(() => {
        fetchVendors();
    }, [reload]);

    return (
        <div className="overflow-x-auto">
            {vendors ?
                <table className="rounded overflow-hidden w-full table-auto">
                    <thead className="  bg-[#F5F5F5]">
                        <tr >
                            <th className="md:block hidden py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold text-nowrap">Vendor Name</th>
                            <th className="md:hidden block py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold text-nowrap">Name</th>
                            <th className="py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold">ID</th>
                            <th className="md:hidden block py-3 px-0.5 md:px-4 md:py-5 text-center text-[10px] md:text-base md:text-left font-semibold text-nowrap">Value</th>
                            <th className="md:block hidden py-3 px-0.5 md:px-4 md:py-5 text-center text-[10px] md:text-base md:text-left font-semibold text-nowrap">Contract Value</th>
                            <th className="py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold">Category</th>
                            <th className="py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold">Type</th>
                            <th className="py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold">Status</th>
                            <th className="py-3 px-0.5 md:px-4 md:py-5 text-center md:text-left text-[10px] md:text-base font-semibold">Action</th>
                        </tr>
                    </thead>
                    {vendors.length !== 0 ? vendors.map((item, index) => (
                        <tbody className=' border-b border-slate-100'>
                            <tr key={index}>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4 flex flex-row items-center gap-0.5 md:gap-2"><Image src={item.imageUrl} width={45} height={45} alt='' className="object-cover rounded-full h-7 w-7 mx-0.5 md:w-[44px] md:h-[44px] md:mx-2" /><p>{item.name}</p></td>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4">{item.id}</td>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4 max-w-10 truncate md:max-w-full">{item.contractvalue}</td>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4 text-nowrap max-w-12 truncate md:max-w-full">{item.vendorCategory}</td>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4">{item.type}</td>
                                <td className="py-2 px-1 text-[10px] md:text-base md:p-4 max-w-12 truncate md:max-w-full">
                                    <span className=" bg-[#f1f6e7] text-[#6BA10F] px-1 md:px-2 py-1 text-[10px] md:text-sm rounded-lg">Permanent</span>
                                </td>
                                {/*   ACTIONS   */}
                                <td className="flex flex-row justify-center items-center gap-1 md:gap-3">
                                    {/*   VIEW   */}
                                    <Popover>
                                        <PopoverTrigger>
                                            <button className='text-slate-600 hover:text-black text-lg h-10'><RiEyeLine className='text-sm mt-1 md:text-xl' /></button>
                                        </PopoverTrigger>
                                        <PopoverContent className='bg-slate-50 relative right-16 top-[-45] md:top-auto md:right-[22%] w-auto  md:w-max p-2 md:p-4'>
                                            <h4 className='font-semibold md:font-bold text-left items-center text-sm md:text-base'>Vendor Detail</h4>
                                            <div>
                                                <div className='flex flex-col md:flex-row gap-1 md:gap-4 mt-2 md:mt-4'>
                                                        <div className='flex justify-start items-start mr-2 md:mr-3 w-full flex-col gap-2'>
                                                            <p className="font-medium text-gray-600 text-[12px]">Vendor Image: </p>
                                                            <Image className='rounded-xl object-cover h-[131.53px] w-[125px] md:h-[171px] md:w-[150px] ' src={item!.imageUrl} height={150} width={150} alt='' />
                                                        </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className='mt-1 md:mt-3 flex flex-col md:flex-row gap-0.5 md:gap-2'>
                                                            <div className="text-[12px] md:text-base font-medium text-gray-600 text-nowrap flex flex-row"><TiBriefcase className='text-2xl' /><p>Vendor Name: </p></div>
                                                            <div className="text-[12px] md:text-base text-black font-semibold px-2">{item.name}</div>
                                                        </div>

                                                        <div className="mt-1 md:mt-3 flex flex-col md:flex-row gap-0.5 md:gap-2">
                                                            <div className="text-[12px] md:text-base font-medium text-gray-600 text-nowrap">Email: </div>
                                                            <div className="text-[12px] md:text-base text-black font-semibold">{item.email}</div>
                                                        </div>
                                                        <div className="mt-1 md:mt-3 flex flex-col md:flex-row gap-0.5 md:gap-2">
                                                            <div className="text-[12px] md:text-base font-medium text-gray-600 text-nowrap">Contract Value </div>
                                                            <div className="text-[12px] md:text-base text-black font-semibold">{item.contractvalue}</div>
                                                        </div>
                                                        <div className="mt-1 md:mt-3 flex flex-col md:flex-row gap-0.5 md:gap-2">
                                                            <div className="text-[12px] md:text-base font-medium text-gray-600 text-nowrap">Vendor Category: </div>
                                                            <div className="text-[12px] md:text-base text-black font-semibold ">{item.vendorCategory}</div>
                                                        </div>
                                                        <p className='mt-1 md:mt-3 text-gray-600 font-semibold text-[12px] inline-flex'>Date: <p className='text-black'>{moment(item.date).format('MMMM Do, YYYY')}</p></p>
                                                    </div>
                                                </div>
                                                <div className="mt-1 md:mt-3 flex flex-col md:flex-row gap-0.5 md:gap-2">
                                                <div className="text-[12px] md:text-base text-black font-semibold max-w-32 md:max-w-full">
                                                    <span className="text-[12px] md:text-base font-medium text-gray-600">Note: </span>
                                                    {item.note}</div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    {/*   EDIT   */}
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <button onClick={() => { fillData(item) }} className='text-slate-600 hover:text-black text-lg'>
                                                <RiEdit2Line className='text-sm md:text-xl' />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Edit vendor</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <div className="mb-2 md:mb-4 flex gap-2 md:gap-4">
                                                        <div className="w-full">
                                                            <input value={editName} onChange={(e) => { setEditName(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" type="text" placeholder="Vendor Name" />
                                                        </div>
                                                        <div className="w-full">
                                                            <input value={editEmail} onChange={(e) => { setEditEmail(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" type="email" placeholder="Contract Email" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 md:mb-4 flex gap-2 md:gap-4">
                                                        <div className="w-full">
                                                            <input value={editValue} onChange={(e) => { setEditValue(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" type="text" placeholder="Contract Value" />
                                                        </div>
                                                        <div className="w-full">
                                                            <input value={editCategory} onChange={(e) => { setEditCategory(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" type="text" placeholder="Category" />
                                                        </div>
                                                        <div className="w-full">
                                                            <Select defaultValue={item.type} onValueChange={(value: string) => { setEditType(value) }}>
                                                                <SelectTrigger className="border border-slate-300 appearance-none h-[38px] md:h-[52px] rounded-xl w-full p-4 focus:ring-1 leading-tight outline-none text-gray-900 text-sm  focus:text-black">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Office">Office</SelectItem>
                                                                    <SelectItem value="Remote">Remote</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 md:mb-4">
                                                        <input value={editAddress} onChange={(e) => { setEditAddress(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" type="text" placeholder="Address" />
                                                    </div>
                                                    <div>
                                                        <textarea value={editNote} onChange={(e) => { setEditNote(e.target.value) }} className="border-slate-300 appearance-none border rounded-xl w-full p-2 px-3 md:p-4 focus:outline-none focus:ring-1 focus:ring-black text-gray-900" placeholder="Notes"></textarea>
                                                    </div>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className='text-gray-900 font-semibold py-2 rounded-lg focus:outline-none focus:border border-slate-300-outline'>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => { editData(item.id) }} className=" bg-[#DDFF8F] hover:bg-[#C8F064] text-gray-900 font-semibold py-2 rounded-lg focus:outline-none focus:border border-slate-300-outline">Save</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    {/*   DELETE   */}
                                    <AlertDialog>
                                        <AlertDialogTrigger><button className='text-slate-600 hover:text-black text-lg'><RiDeleteBin6Line className='text-sm md:text-xl' /></button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>You want to delete {item.name} vendor?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will permanently delete {item.name} vendor data.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => { deleteVendor(item.id); }} className='bg-[#ff3b3b] hover:bg-[#ff4d4d]'>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </td>
                            </tr>
                        </tbody>
                    )) :
                        <div className='h-52 w-[70vh] absolute left-[40%] items-center'>
                            <p className='text-center text-nowrap m-24 font-xl font-semibold'>The vendor list is currently empty.</p>
                        </div>
                    }
                </table>
                :
                <div className='flex items-center justify-center h-[500px]'>
                    <span className="loader"></span>
                </div>
            }
        </div>
    )
}

export default VendorsList