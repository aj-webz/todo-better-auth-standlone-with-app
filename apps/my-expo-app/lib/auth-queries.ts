import { useQuery } from "@tanstack/react-query";
import { authClient  } from "./authClient";

export const useUser = () =>
{
    return useQuery({
        queryKey:["user"],
        queryFn:async () =>
        {
            const { data, error } = await authClient.getSession();
            if(error)
            {
                throw error;
            }
            return data?.user ?? null;
        }
    })
}