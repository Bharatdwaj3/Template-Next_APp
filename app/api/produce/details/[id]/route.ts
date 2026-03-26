// produce/details/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Produce from "@/model/produce.model";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { connectDB } from "@/lib/db";
import PERMISSIONS from "@/config/permissions.config";
import upload from "@/services/mutler";
 
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
 
    const produce = await Produce.findById(id)
      .populate("farmerId", "userName fullName avatar accountType");
 
    if (!produce) {
      return NextResponse.json({ message: "Produce not found" }, { status: 404 });
    }
 
    return NextResponse.json({ success: true, produce });
  } catch (error: any) {
    console.error("Get produce error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
 
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getCurrentUser();
 
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
 
    // ✅ fixed: removed 'grocer' — only farmer and admin can update produce
    if (!["farmer", "admin"].includes(user.accountType || "")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
 
    if (!PERMISSIONS[user.accountType || ""]?.includes("update_produce")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
 
    const existingProduce = await Produce.findById(id);
    if (!existingProduce) {
      return NextResponse.json({ message: "Produce not found" }, { status: 404 });
    }
 
    if (user.accountType === "farmer" && existingProduce.farmerId.toString() !== user.id) {
      return NextResponse.json(
        { message: "You can only update your own produce" },
        { status: 403 }
      );
    }
 
    const updateData: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";
 
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.name) updateData.name = body.name;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.price !== undefined) updateData.price = parseFloat(body.price);
      if (body.unit) updateData.unit = body.unit;
      if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
      if (body.category) updateData.category = body.category;
      if (body.isOrganic !== undefined) updateData.isOrganic = body.isOrganic;
      if (body.rating !== undefined) updateData.rating = parseFloat(body.rating);
    }
 
    if (contentType.includes("multipart/form-data")) {
      await new Promise((resolve, reject) => {
        upload.single("image")(req as any, {} as any, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
 
      const multerReq: any = req;
      if (multerReq.file) {
        updateData.img = multerReq.file.path;
        updateData.cloudinaryId = multerReq.file.filename;
      }
    }
 
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No data provided to update" },
        { status: 400 }
      );
    }
 
    const updated = await Produce.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
 
    return NextResponse.json({
      success: true,
      message: "Produce updated successfully",
      produce: updated,
    });
  } catch (error: any) {
    console.error("Update produce error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
 
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getCurrentUser();
 
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
 
    const produce = await Produce.findById(id);
    if (!produce) {
      return NextResponse.json({ message: "Produce not found" }, { status: 404 });
    }
 
    if (user.accountType !== "admin") {
      if (user.accountType !== "farmer" || produce.farmerId.toString() !== user.id) {
        return NextResponse.json(
          { message: "Forbidden - Only owner or admin can delete" },
          { status: 403 }
        );
      }
    }
 
    await Produce.findByIdAndDelete(id);
 
    return NextResponse.json({
      success: true,
      message: "Produce deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete produce error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}