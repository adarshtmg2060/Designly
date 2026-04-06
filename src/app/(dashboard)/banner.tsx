"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Loader2, PencilIcon } from "lucide-react";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useCreateTemplate } from "@/features/templates/use-create-template";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

export const Banner = () => {
  const router = useRouter();
  const mutation = useCreateProject();
  const templateMutation = useCreateTemplate();

  const [openProject, setOpenProject] = useState(false);

  const [openTemplate,setOpenTemplate] = useState(false);

 const [formTemplate, setFormTemplate] = useState<{
  name: string;
  image: string;  
  json: File | null;
}>({
  name: "",
  image: "",
  json: null,
});






  const [formProject, setFormProject] = useState({
    name: "",
    json: "",
    width: 900,
    height: 1200,
  });

  const handleSubmit = () => {
    if (!formProject.name || !formProject.width || !formProject.height) {
      alert("All fields are required");
      return;
    }

    mutation.mutate(formProject, {
      onSuccess: ({ data }) => {
        setOpenProject(false);
        router.push(`/editor/${data.id}`);
      },
    });
  };

  const handleTemplateSubmit = async ()=>{

    if (!formTemplate.name || !formTemplate.image || !formTemplate.json) {
      alert("All fields required");
      return;
    }

    // convert to string
    const jsonText = await formTemplate.json.text();


     templateMutation.mutate({
        name: formTemplate.name,
        image: formTemplate.image,
        json: jsonText,
      }, {
      onSuccess: () => {
        setOpenTemplate(false);
        // Clear the form
        setFormTemplate({
          name: "",
          image: "",
          json: null,
        });
      },
    });

    
  }

  return (
    <>
      <div className="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]">
        <div className="rounded-full size-28 hidden md:flex items-center justify-center bg-white/50">
          <div className="rounded-full size-20 flex items-center justify-center bg-white">
            <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl md:text-3xl font-semibold">
            Visualize your ideas with Designly
          </h1>
          <p className="text-xs md:text-sm mb-2">
            Turn inspiration into design in  with less efforts and times
          </p>

           <div className="flex gap-5">
            <Button
            onClick={() => setOpenProject(true)}
            variant="secondary"
            className="w-[160px]"
          >
            Start Project
            <ArrowRight className="size-4 ml-2" />
          </Button>

          <Button
            onClick={() => setOpenTemplate(true)}
            variant="secondary"
            className="w-[160px]"
          >
            Create Template
            <PencilIcon className="size-4 ml-2" />
          </Button>
           </div>
        </div>
      </div>

      {/* Modal for creating project */}
      <Dialog open={openProject} onOpenChange={setOpenProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Project Name"
              value={formProject.name}
              onChange={(e) => setFormProject({ ...formProject, name: e.target.value })}
              required
            />

            <Input
              type="number"
              placeholder="Width"
              value={formProject.width}
              onChange={(e) =>
                setFormProject({ ...formProject, width: Number(e.target.value) })
              }
              required
            />

            <Input
              type="number"
              placeholder="Height"
              value={formProject.height}
              onChange={(e) =>
                setFormProject({ ...formProject, height: Number(e.target.value) })
              }
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* modal for creating templates */}
    <Dialog open={openTemplate} onOpenChange={setOpenTemplate}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Create Template
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Upload an image and JSON file to create a reusable template.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* Template Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Template Name</label>
            <Input
              placeholder="e.g. Instagram Post Template"
              value={formTemplate.name}
              onChange={(e) =>
                setFormTemplate({ ...formTemplate, name: e.target.value })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Template Image</label>
            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:bg-muted/40 transition cursor-pointer">
              <UploadButton
                endpoint="imageUploader"
                appearance={{
                  button:
                    "bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90",
                }}
                content={{ button: "Upload Image" }}
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.url;
                  if (url) {
                    setFormTemplate((prev) => ({ ...prev, image: url }));
                  }
                }}
                onUploadError={(err) => console.error(err)}
              />

              <p className="text-xs text-muted-foreground text-center">
                PNG, JPG up to 4MB
              </p>

              {formTemplate.image && (
                <Image
                  src={formTemplate.image}
                  height={200}
                  width={200}
                  alt="preview"
                  className="w-full h-30 object-cover rounded-md border mt-1"
                />
              )}
            </div>
          </div>

          {/* JSON Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">JSON File</label>
            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:bg-muted/40 transition cursor-pointer">
              <Input
                type="file"
                accept=".json,application/json"
                onChange={(e) =>
                  setFormTemplate({
                    ...formTemplate,
                    json: e.target.files?.[0] || null,
                  })
                }
                className="cursor-pointer"
              />

              <p className="text-xs text-muted-foreground text-center">
                Upload template configuration (.json)
              </p>

              {formTemplate.json && (
                <p className="text-xs text-green-600 font-medium">
                  {formTemplate.json.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6">
          <Button
            onClick={handleTemplateSubmit}
            disabled={templateMutation.isPending}
            className="w-full h-12 text-base"
          >
            {templateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Creating Template...
              </>
            ) : (
              "Create Template"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
