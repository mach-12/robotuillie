import { z } from "zod";
import { rdbProcedure, createTRPCRouter } from "../trpc";
import {
  type ReceptorResponse,
  type SearchIngredientInRecipesResponse,
  getAccessToken,
  addSecondsToCurrentTime,
} from "../rdbUtils";

export const rdbRouter = createTRPCRouter({
  SearchIngredientInRecipes: rdbProcedure
    .input(
      z.object({
        ingredient: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      try {
        const response =
          (await res.json()) as SearchIngredientInRecipesResponse[];

        return response;
      } catch (error) {
        const token = await getAccessToken();
        if (token) {
          const myHeaders = new Headers();

          myHeaders.append("Authorization", `Bearer ${token.access_token}`);

          const res = await fetch(
            `https://cosylab.iiitd.edu.in/api/recipeDB/searchingredientinrecipes/${input.ingredient}`,
            {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            },
          );

          await ctx.db.recipeDbToken.create({
            data: {
              access_token: token.access_token,
              expires_on: addSecondsToCurrentTime(token.expires_in),
              refresh_token: token.refresh_token,
              rtoken_expires_on: addSecondsToCurrentTime(
                token.refresh_expires_in,
              ),
              token_type: token.token_type,
              id_token: token.id_token,
            },
          });

          const response =
            (await res.json()) as SearchIngredientInRecipesResponse[];

          return response;
        }
      }
    }),
  Receptors: rdbProcedure.mutation(async ({ ctx }) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ctx.response.access_token}`);

    const res = await fetch(
      "https://cosylab.iiitd.edu.in/api/recipeDB/receptors",
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      },
    );

    try {
      const response = (await res.json()) as ReceptorResponse[];
      return response;
    } catch (error) {
      const token = await getAccessToken();
      if (token) {
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${ctx.response.access_token}`,
        );

        const res = await fetch(
          "https://cosylab.iiitd.edu.in/api/recipeDB/receptors",
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          },
        );

        await ctx.db.recipeDbToken.create({
          data: {
            access_token: token.access_token,
            expires_on: addSecondsToCurrentTime(token.expires_in),
            refresh_token: token.refresh_token,
            rtoken_expires_on: addSecondsToCurrentTime(
              token.refresh_expires_in,
            ),
            token_type: token.token_type,
            id_token: token.id_token,
          },
        });

        const response = (await res.json()) as ReceptorResponse[];
        return response;
      }
    }
  }),
});
