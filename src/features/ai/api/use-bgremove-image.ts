import { useMutation } from "@tanstack/react-query";

export const useRemoveBackground = () => {
  return useMutation({
    mutationFn: async (imageUrl: string): Promise<string> => {
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove background");
      }

      // Receive image as blob
      const blob = await res.blob();

      // Convert to usable URL for <img />
      return URL.createObjectURL(blob);
    },
  });
};
