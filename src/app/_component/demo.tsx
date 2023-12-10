"use client";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { api } from "~/trpc/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {RecipieOfTheDay} from "~/server/api/rdbUtils";

export default function Demo() {
  const [input, setinput] = useState("");
  const SearchMutation = api.reciepeDb.SearchIngredientInRecipes.useMutation();

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input !== "") SearchMutation.mutate({ ingredient: input });
    setinput("");
  };

  return (
    <>
      <form
        onSubmit={HandleSubmit}
        className="flex flex-col items-center overflow-x-hidden"
      >
        <Textarea
          minRows={1}
          color="primary"
          variant="bordered"
          className="w-[250px] overflow-x-hidden md:w-[480px] "
          size="lg"
          value={input}
          onValueChange={setinput}
          enterKeyHint="search"
        />
        <br />
        <Button
          variant="bordered"
          className="mb-5  mt-2"
          type="submit"
          color="secondary"
        >
          Search
        </Button>
      </form>

      {SearchMutation.isLoading && <Spinner size="lg" />}

      {SearchMutation.isError && (
        <h1 style={{ color: "red" }}>{SearchMutation.error.message}</h1>
      )}

      {SearchMutation.isSuccess && //@ts-expect-error error
          <Table aria-label="Recipies" className={"max-w-sm "} color="primary">
            <TableHeader>
              <TableColumn>Recipie</TableColumn>
            </TableHeader>
            <TableBody>
              {SearchMutation.data
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
                  .map((val, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{val.ingredient}</TableCell>
                      </TableRow>
                  ))}
            </TableBody>
          </Table>
      }


    </>
  );
}
