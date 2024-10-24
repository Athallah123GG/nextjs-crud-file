import CreateForm from "@/components/create-form"

const CreatePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="bg-white rounded-sm shadow p-8">
              <h1 className="text-2xl mb-5 font-bold">Upload Image</h1>
              <CreateForm/>
        </div>
    </div>
  )
}

export default CreatePage
