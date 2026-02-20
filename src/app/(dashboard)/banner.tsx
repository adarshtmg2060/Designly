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
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";

export const Banner = () => {
  const router = useRouter();
  const mutation = useCreateProject();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    json: "",
    width: 900,
    height: 1200,
  });

  const handleSubmit = () => {
    if (!form.name || !form.width || !form.height) {
      alert("All fields are required");
      return;
    }

    mutation.mutate(form, {
      onSuccess: ({ data }) => {
        setOpen(false);
        router.push(`/editor/${data.id}`);
      },
    });
  };

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
            Turn inspiration into design in no time. Simply upload an image and
            let AI do the rest.
          </p>

          <Button
            onClick={() => setOpen(true)}
            variant="secondary"
            className="w-[160px]"
          >
            Start Project
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              type="number"
              placeholder="Width"
              value={form.width}
              onChange={(e) =>
                setForm({ ...form, width: Number(e.target.value) })
              }
              required
            />

            <Input
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={(e) =>
                setForm({ ...form, height: Number(e.target.value) })
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
    </>
  );
};
