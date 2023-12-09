import { z } from "zod";
import { rdbProcedure, createTRPCRouter } from "../trpc";
import { type ReceptorResponse, type SearchIngredientInRecipesResponse } from "../rdbUtils";

export const rdbRouter = createTRPCRouter({
  SearchIngredientInRecipes: rdbProcedure
    .input(
      z.object({
        ingredient: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const myHeaders = new Headers();

      myHeaders.append("Authorization", `Bearer ${ctx.response.access_token}`);

      const res = await fetch(
        `https://cosylab.iiitd.edu.in/api/recipeDB/searchingredientinrecipes/${input.ingredient}`,
        {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        },
      );

      const response =
        (await res.json()) as SearchIngredientInRecipesResponse[];
      return response;
    }),
    Receptors: rdbProcedure
    .query(async({ctx})=>{

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${ctx.response.access_token}`);

        const res = await fetch("https://cosylab.iiitd.edu.in/api/recipeDB/receptors", {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        })

        const response = await res.json() as ReceptorResponse[];
        return response
       
    })
});
