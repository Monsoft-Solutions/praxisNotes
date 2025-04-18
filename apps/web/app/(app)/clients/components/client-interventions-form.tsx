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
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { ClientFormValues } from "./validation";
import { Intervention } from "@praxisnotes/database";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

interface ClientInterventionsFormProps {
  existingInterventions: Intervention[];
}

export function ClientInterventionsForm({
  existingInterventions = [],
}: ClientInterventionsFormProps) {
  const { control, watch, setValue } = useFormContext<ClientFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "interventions",
  });

  // State to track which popover is open
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const behaviors = watch("behaviors");

  const addIntervention = () => {
    append({
      name: "",
      description: null,
      behaviorIndices: [],
      isNew: true,
    });
  };

  // Function to handle keyboard navigation in combobox
  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    value: string,
  ) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();

      // If value entered doesn't match existing intervention, mark as new
      const isExisting = existingInterventions.some(
        (i) => i.name.toLowerCase() === value.toLowerCase(),
      );

      if (!isExisting && value.trim() !== "") {
        setValue(`interventions.${index}.isNew`, true);
        setOpenPopoverIndex(null);
      }
    } else if (e.key === "Escape") {
      setOpenPopoverIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Interventions</h3>
        <Button
          type="button"
          onClick={addIntervention}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Intervention
        </Button>
      </div>

      {behaviors.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            You need to add behaviors first before adding interventions.
          </p>
        </div>
      ) : fields.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No interventions added yet. Click the button above to add one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Intervention {index + 1}
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
                  name={`interventions.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover
                        open={openPopoverIndex === index}
                        onOpenChange={(open) => {
                          setOpenPopoverIndex(open ? index : null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              data-trigger
                              onClick={() => setOpenPopoverIndex(index)}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? field.value
                                : "Select or create an intervention"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search or create an intervention..."
                              value={field.value || ""}
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Mark as new intervention if not empty and doesn't match existing interventions
                                const isExisting = existingInterventions.some(
                                  (i) =>
                                    i.name.toLowerCase() ===
                                    value.toLowerCase(),
                                );
                                setValue(
                                  `interventions.${index}.isNew`,
                                  value.trim() !== "" && !isExisting,
                                );
                              }}
                              onKeyDown={(e) =>
                                handleKeyDown(e, index, field.value || "")
                              }
                              className="border-none focus:ring-0"
                            />
                            <CommandEmpty>
                              {field.value && field.value.trim() !== "" && (
                                <div className="flex flex-col items-center py-2">
                                  <p className="text-sm text-muted-foreground mb-2">
                                    No existing intervention found.
                                  </p>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setValue(
                                        `interventions.${index}.isNew`,
                                        true,
                                      );
                                      setOpenPopoverIndex(null);
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add &quot;{field.value}&quot;
                                  </Button>
                                </div>
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {existingInterventions
                                .filter(
                                  (intervention) =>
                                    !field.value ||
                                    intervention.name
                                      .toLowerCase()
                                      .includes(field.value.toLowerCase()),
                                )
                                .map((intervention) => (
                                  <CommandItem
                                    key={intervention.id}
                                    value={intervention.name}
                                    onSelect={() => {
                                      setValue(
                                        `interventions.${index}.name`,
                                        intervention.name,
                                      );
                                      setValue(
                                        `interventions.${index}.description`,
                                        intervention.description,
                                      );
                                      setValue(
                                        `interventions.${index}.isNew`,
                                        false,
                                      );
                                      setOpenPopoverIndex(null);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === intervention.name
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {intervention.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`interventions.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter intervention description"
                          {...field}
                          value={field.value || ""}
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
                    name={`interventions.${index}.behaviorIndices`}
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
