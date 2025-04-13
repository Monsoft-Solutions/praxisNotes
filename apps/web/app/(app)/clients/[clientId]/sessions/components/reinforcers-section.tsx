"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Tag } from "./tag";
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
  CardDescription,
} from "@workspace/ui/components/card";

export function ReinforcersSection() {
  const { control, setValue, getValues } = useFormContext();
  const [reinforcerInput, setReinforcerInput] = useState("");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    if (e.key === "Enter" && reinforcerInput.trim()) {
      e.preventDefault();

      if (!field.value.includes(reinforcerInput.trim())) {
        const updatedReinforcer = [...field.value, reinforcerInput.trim()];
        field.onChange(updatedReinforcer);
      }

      setReinforcerInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reinforcers</CardTitle>
        <CardDescription>
          Record reinforcers used during the session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="reinforcers"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add reinforcer and press Enter"
                      value={reinforcerInput}
                      onChange={(e) => setReinforcerInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => {
                      if (reinforcerInput.trim()) {
                        if (!field.value.includes(reinforcerInput.trim())) {
                          field.onChange([
                            ...field.value,
                            reinforcerInput.trim(),
                          ]);
                        }
                        setReinforcerInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((reinforcer: string, index: number) => (
                      <Tag
                        key={`${reinforcer}-${index}`}
                        text={reinforcer}
                        onRemove={() => {
                          const newReinforcers = [...field.value];
                          newReinforcers.splice(index, 1);
                          field.onChange(newReinforcers);
                        }}
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
