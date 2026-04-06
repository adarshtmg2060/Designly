"use client";

import React from "react";
import { useGetTemplates } from "@/features/templates/use-get-templates";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export const TemplateSection = () => {
  const { data, isLoading, isError } = useGetTemplates();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Loading Templates...
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load templates.</div>;
  }

  // click handler that receives the template
  const handleClick = (template: { name: string; json: string }) => {
    // console.log("Template Name:", template.name);
    // console.log("Template JSON:", template.json);

    
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Recent Templates</h3>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.pages?.map((page) =>
          page.data.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col"
              onClick={() => handleClick(template)}
            >
              {/* Image */}
              <div className="relative w-full h-40 bg-gray-100">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name */}
              <div className="p-2 text-center font-medium text-sm">
                {template.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};