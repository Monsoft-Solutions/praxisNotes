"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Plus, Trash2, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import { ClientFormValues } from "./validation";

export function ClientReplacementProgramsForm() {
  const { control, watch } = useFormContext<ClientFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "replacementPrograms",
  });

  const behaviors = watch("behaviors");

  const addReplacementProgram = () => {
    append({
      name: "",
      description: null,
      baseline: 0,
      behaviorIndices: [],
      isNew: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Replacement Programs</h3>
        <Button
          type="button"
          onClick={addReplacementProgram}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Program
        </Button>
      </div>

      {behaviors.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            You need to add behaviors first before adding replacement programs.
          </p>
        </div>
      ) : fields.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No replacement programs added yet. Click the button above to add
            one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Program {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name={`replacementPrograms.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter program name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`replacementPrograms.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter program description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`replacementPrograms.${index}.baseline`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Baseline <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter baseline value"
                          {...field}
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>
                    Associated Behaviors{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormField
                    control={control}
                    name={`replacementPrograms.${index}.behaviorIndices`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          {behaviors.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No behaviors available to associate.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {behaviors.map((behavior, behaviorIndex) => (
                                <BehaviorCheckItem
                                  key={behaviorIndex}
                                  behavior={behavior}
                                  index={behaviorIndex}
                                  value={field.value || []}
                                  onChange={(checked) => {
                                    const updatedIndices = checked
                                      ? [...field.value, behaviorIndex]
                                      : field.value.filter(
                                          (i) => i !== behaviorIndex,
                                        );
                                    field.onChange(updatedIndices);
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface BehaviorCheckItemProps {
  behavior: any;
  index: number;
  value: number[];
  onChange: (checked: boolean) => void;
}

function BehaviorCheckItem({
  behavior,
  index,
  value,
  onChange,
}: BehaviorCheckItemProps) {
  const isChecked = value.includes(index);

  return (
    <label
      className={cn(
        "flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors",
        isChecked
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/50",
      )}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <div className="flex-1">
        <div className="font-medium">{behavior.name}</div>
        <div className="text-xs text-muted-foreground">
          Baseline: {behavior.baseline} ({behavior.type})
        </div>
      </div>
    </label>
  );
}
