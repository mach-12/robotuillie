import { env } from "~/env";

export interface AccessTokenType {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  not_before_policy?: number;
  session_state: string;
  scope: string;
}

interface recipe {
  reigon: string;
  recipe_id: number;
  recipe_title: string;
  sub_region: string;
}

export interface SearchIngredientInRecipesResponse {
  _id: string;
  ingredient: string;
  recipes: recipe[];
}

export interface ReceptorResponse {
  _id: string,
  id: string,
  taste : string,
  receptor_name : string
  uniprot_id : string
}

export const getAccessToken = async () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "app-ims");
  urlencoded.append("grant_type", "password");
  urlencoded.append("username", env.RDB_USERNAME);
  urlencoded.append("password", env.RDB_PASSWORD);
  urlencoded.append("scope", "openid");

  try {
    const res = await fetch(
      "https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token",
      {
        method: "POST",
        headers,
        body: urlencoded,
        redirect: "follow",
      },
    );

    if (!res.ok) throw new Error("rdb auth did not work");

    const response = (await res.json()) as AccessTokenType;
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const refreshToken = async (refresh_token: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "app-ims");
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", refresh_token);

  try {
    const res = await fetch(
      "https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token",
      {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      },
    );

    if (!res.ok) throw new Error("rdb auth did not work");

    const response = (await res.json()) as AccessTokenType;
    return response;
  } catch (error) {
    console.log(error);
  }
};

export function addSecondsToCurrentTime(seconds: number): Date {
  const currentTime = new Date();
  const modifiedTime = new Date(currentTime.getTime() + seconds * 1000);

  return modifiedTime;
}
