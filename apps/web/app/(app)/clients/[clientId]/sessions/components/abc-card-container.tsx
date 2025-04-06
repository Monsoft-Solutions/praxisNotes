"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ABCCard } from "./abc-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";

export function ABCCardContainer() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "abcEntries",
  });

  // Add a new empty ABC entry
  const handleAddEntry = () => {
    append({
      id: uuidv4(),
      activityAntecedent: "",
      behaviors: [],
      interventions: [],
      replacementPrograms: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ABC Data</CardTitle>
        <CardDescription>
          Record Antecedent, Behavior, and Consequence data for the session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <ABCCard
            key={field.id}
            index={index}
            onRemove={fields.length > 1 ? () => remove(index) : undefined}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEntry}
          className="w-full mt-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add ABC Entry
        </Button>
      </CardContent>
    </Card>
  );
}
