import { useMutation } from "convex/react";
import { useState } from "react";

export const useMutationState = <TArgs extends object, TResult = unknown>(mutationToRun: unknown) => {
    const [pending,setPending]=useState(false);
    type MutationExecutor = (args: TArgs) => Promise<TResult>;
    const mutationfn = (useMutation(mutationToRun as never) as unknown) as MutationExecutor;

    const mutate = (payload: TArgs) => {
        setPending(true)

        return mutationfn(payload)
        .then((res)=>{
            return res;
        })
        .catch((error)=>{
            throw error
        })
        .finally(()=>setPending(false))
    }

    return {mutate,
        pending
    }

}