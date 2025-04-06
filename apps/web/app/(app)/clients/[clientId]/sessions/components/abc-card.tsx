"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Tag } from "./tag";
import { Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface ABCCardProps {
  index: number;
  onRemove?: () => void;
}

export function ABCCard({ index, onRemove }: ABCCardProps) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // State for current input values
  const [behaviorInput, setBehaviorInput] = useState("");
  const [interventionInput, setInterventionInput] = useState("");
  const [replacementInput, setReplacementInput] = useState("");

  // Handle tag inputs
  const handleTagAdd = (
    type: "behaviors" | "interventions" | "replacementPrograms",
    value: string,
    setInputValue: (value: string) => void,
  ) => {
    if (!value.trim()) return;

    const fieldPath = `abcEntries.${index}.${type}`;
    const currentValues = getValues(fieldPath) || [];

    if (!currentValues.includes(value.trim())) {
      const updatedValues = [...currentValues, value.trim()];
      setValue(fieldPath, updatedValues, { shouldValidate: true });
      setInputValue("");
    }
  };

  const handleTagRemove = (
    type: "behaviors" | "interventions" | "replacementPrograms",
    tagIndex: number,
  ) => {
    const fieldPath = `abcEntries.${index}.${type}`;
    const currentValues = [...getValues(fieldPath)];
    currentValues.splice(tagIndex, 1);
    setValue(fieldPath, currentValues, { shouldValidate: true });
  };

  // Handle key down for tag inputs
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "behaviors" | "interventions" | "replacementPrograms",
    value: string,
    setInputValue: (value: string) => void,
  ) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      handleTagAdd(type, value, setInputValue);
    }
  };

  return (
    <Card className={cn("relative", index > 0 && "mt-8")}>
      {onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove ABC Entry</span>
        </Button>
      )}

      <CardHeader>
        <CardTitle className="text-lg">ABC Entry #{index + 1}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Activity/Antecedent */}
        <FormField
          control={control}
          name={`abcEntries.${index}.activityAntecedent`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity/Antecedent</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what happened before the behavior occurred..."
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Behaviors */}
        <FormField
          control={control}
          name={`abcEntries.${index}.behaviors`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Behaviors</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add behavior and press Enter"
                      value={behaviorInput}
                      onChange={(e) => setBehaviorInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          "behaviors",
                          behaviorInput,
                          setBehaviorInput,
                        )
                      }
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() =>
                      handleTagAdd("behaviors", behaviorInput, setBehaviorInput)
                    }
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((behavior: string, i: number) => (
                      <Tag
                        key={`${behavior}-${i}`}
                        text={behavior}
                        onRemove={() => handleTagRemove("behaviors", i)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interventions */}
        <FormField
          control={control}
          name={`abcEntries.${index}.interventions`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interventions</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add intervention and press Enter"
                      value={interventionInput}
                      onChange={(e) => setInterventionInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          "interventions",
                          interventionInput,
                          setInterventionInput,
                        )
                      }
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() =>
                      handleTagAdd(
                        "interventions",
                        interventionInput,
                        setInterventionInput,
                      )
                    }
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((intervention: string, i: number) => (
                      <Tag
                        key={`${intervention}-${i}`}
                        text={intervention}
                        onRemove={() => handleTagRemove("interventions", i)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Replacement Programs */}
        <FormField
          control={control}
          name={`abcEntries.${index}.replacementPrograms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Replacement Programs</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add replacement program and press Enter"
                      value={replacementInput}
                      onChange={(e) => setReplacementInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          "replacementPrograms",
                          replacementInput,
                          setReplacementInput,
                        )
                      }
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() =>
                      handleTagAdd(
                        "replacementPrograms",
                        replacementInput,
                        setReplacementInput,
                      )
                    }
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((program: string, i: number) => (
                      <Tag
                        key={`${program}-${i}`}
                        text={program}
                        onRemove={() =>
                          handleTagRemove("replacementPrograms", i)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
