import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//                            POST REQUEST

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	try {
		const { imageUrl, vendorName, contractName, number, email, date, type, adress, note } = await request.json();

		if (imageUrl || vendorName || contractName || number || email || date || type || adress || note) {
			console.log("Field missing --------- ERROR 1")
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields to add vendor",
				},
				{ status: 400, statusText: "Bad Request" }
			);
		}

		const newVendor = await prisma.vendor.create({
			data: { imageUrl, vendorName ,contractName , number, email, date , type, adress,note },
		});
		console.log("Vendors uploaded to DB --------- DONE 2")

		return NextResponse.json(
			{
				success: true,
				message: "vendor added successfully",
				vendor: newVendor,
			},
			{ status: 201, statusText: "Created" }
		);
	} catch (error) {
		console.error(error);
		console.log("SERVER ERROR--------- ERROR 3")

		return NextResponse.json(
			{ success: false, message: "Failed to create new vendor" },
			{ status: 500, statusText: "Internal Server Error" }
		);
	} finally {
		await prisma.$disconnect();
	}
};



//                       GET REQUEST

export const GET = async (): Promise<NextResponse> => {
	try {
		const vendors = await prisma.vendor.findMany();
		if (!vendors) {
			console.log("Faill to fetch --------- ERROR 4")

			throw new Error("Failed to fetch vendor");
		}

		return NextResponse.json(
			{
				success: true,
				massage: "vendors fetched successful",
				vendors,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		console.log("SERVER ERROR --------- ERROR 5")

		return NextResponse.json(
			{
				success: false,
				massage: "Failed to fetch vendor",
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
};