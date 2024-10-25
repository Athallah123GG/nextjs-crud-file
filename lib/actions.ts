"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImageById } from "@/lib/data";

const uploadSchema = z.object({
    title: z.string().min(1),
    image: z.instanceof(File).refine((file) => file.size > 0, { message: "Image is required" })

        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "only images are all allowed",
        })

        .refine((file) => file.size < 4000000, {
            message: "image must less than 4MB",
        }),

});

const EditSchema = z.object({
    title: z.string().min(1),
    image: z.instanceof(File)
        // .refine((file) => file.size > 0, { message: "Image is required" })

        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "only images are all allowed",
        })

        .refine((file) => file.size < 4000000, {
            message: "image must less than 4MB",
        })
        .optional(),

});

export const uploadImage = async (prevState: unknown, formData: FormData) => {

    const validatedFields = uploadSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, image } = validatedFields.data;
    const { url } = await put(image.name, image, {
        access: "public",
        multipart: true,

    });

    try {
        await prisma.upload.create({
            data: {
                title,
                image: url,
            },
        });
    } catch {
        return {
            message: "Failde to create Data"
        }
    }

    revalidatePath("/");
    redirect("/");

};


export const deleteImage = async (id: string): Promise<void> => {
    const data = await getImageById(id);
    if (!data) {
        console.warn("No Data Found");
        return;
    }

    await del(data.image);
    try {
        await prisma.upload.delete({
            where: { id },
        });
    } catch {
        console.error("Failed To Delete Data");
        return;
    }

    revalidatePath("/");
};



// Update Image
export const updateImage = async (id: string, prevState: unknown, formData: FormData) => {

    const validatedFields = EditSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = await getImageById(id);
    if (!data) return { message: "No Data Found" };

    const { title, image } = validatedFields.data;

    let imagePath;

    if (!image || image.size <= 0) {
        imagePath = data.image;
    } else {
        await del(data.image);
        const { url } = await put(image.name, image, {
            access: "public",
            multipart: true,
        });

        imagePath = url;

    }

    try {
        await prisma.upload.update({
            data: {
                title,
                image: imagePath,
            },
            where: { id }
        });
    } catch {
        return {
            message: "Failde to update Data"
        }
    }

    revalidatePath("/");
    redirect("/");

};
