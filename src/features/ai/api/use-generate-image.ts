import { useMutation } from "@tanstack/react-query";

// Define the type of the mutation function argument
type GenerateImageFn = (prompt: string) => Promise<string>;

export const useGenerateImage = () => {
  const mutation = useMutation<string, Error, string>({
    mutationFn: async (prompt: string) => {
      const res = await fetch(
        "https://image-api.adarshtamang2060.workers.dev/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 3c9e5a6d7b2f1a4",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);

      return imgUrl; // Return the object URL of the generated image
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === "pending",
  };
};
