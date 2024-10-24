"use client"

import React, { use } from "react";
import { updateImage } from "@/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/button";
import type { Upload } from '@prisma/client';


const EditForm = ({data}:{data: Upload }) => {

  const [state, formAction] = useFormState(updateImage.bind(null, data.id), null);

  return (
    <form action={formAction} className="mb-4 pt-2">
      <div className="border mb-4">
        <input type="text" name="title" className="py-2 px-4 rounded-sm border-gray-400 w-full" id="" placeholder="Title..." defaultValue={data.title} />
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500 mt-2">{state?.error?.title}</p>
        </div>
      </div>
      <div>
        <input type="file" name="image" className="file:py-2 file:px-4 file:mr-4 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full" />
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500 mt-2">{state?.error?.image}</p>
        </div>
      </div>
      <div className="pt-4 mb-4">
        <SubmitButton label = "update" />
      </div>
    </form>
  )
}

export default EditForm

