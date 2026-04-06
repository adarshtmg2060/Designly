import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof client.api.templates)["$get"],
  200
>;

export const useGetTemplates = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["templates"],
    queryFn: async () => {
      
        const response = await client.api.templates.$get();

        if (!response.ok) {
        throw new Error("Failed to fetch projects");
        }
        
        return response.json();
       
    },
  });
};