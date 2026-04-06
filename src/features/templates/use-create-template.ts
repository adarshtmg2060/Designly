import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.templates)["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.templates)["$post"]
>;

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {

      const res = await client.api.templates.$post({ json });

      if (!res.ok) throw new Error("Failed to create template");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Template created 🎉");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: () => {
      toast.error("Failed to create template");
    },
  });
};