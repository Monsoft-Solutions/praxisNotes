"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ClientFormValues } from "./validation";
import { Behavior } from "@praxisnotes/database";
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

interface ClientBehaviorsFormProps {
  existingBehaviors: Behavior[];
}

export function ClientBehaviorsForm({
  existingBehaviors = [],
}: ClientBehaviorsFormProps) {
  const { control, register, watch, setValue } =
    useFormContext<ClientFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "behaviors",
  });

  // State to track which popover is open
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const addBehavior = () => {
    append({
      name: "",
      description: null,
      baseline: 0,
      type: "frequency",
      topographies: [],
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

      // If value entered doesn't match existing behavior, mark as new
      const isExisting = existingBehaviors.some(
        (b) => b.name.toLowerCase() === value.toLowerCase(),
      );

      if (!isExisting && value.trim() !== "") {
        setValue(`behaviors.${index}.isNew`, true);
        setOpenPopoverIndex(null);
      }
    } else if (e.key === "Escape") {
      setOpenPopoverIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Behaviors</h3>
        <Button
          type="button"
          onClick={addBehavior}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Behavior
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No behaviors added yet. Click the button above to add a behavior.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Behavior {index + 1}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`behaviors.${index}.name`}
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
                                  : "Select or create a behavior"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search or create a behavior..."
                                value={field.value || ""}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Mark as new behavior if not empty and doesn't match existing behaviors
                                  const isExisting = existingBehaviors.some(
                                    (b) =>
                                      b.name.toLowerCase() ===
                                      value.toLowerCase(),
                                  );
                                  setValue(
                                    `behaviors.${index}.isNew`,
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
                                      No existing behavior found.
                                    </p>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => {
                                        setValue(
                                          `behaviors.${index}.isNew`,
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
                                {existingBehaviors
                                  .filter(
                                    (behavior) =>
                                      !field.value ||
                                      behavior.name
                                        .toLowerCase()
                                        .includes(field.value.toLowerCase()),
                                  )
                                  .map((behavior) => (
                                    <CommandItem
                                      key={behavior.id}
                                      value={behavior.name}
                                      onSelect={() => {
                                        setValue(
                                          `behaviors.${index}.name`,
                                          behavior.name,
                                        );
                                        setValue(
                                          `behaviors.${index}.description`,
                                          behavior.description,
                                        );
                                        setValue(
                                          `behaviors.${index}.isNew`,
                                          false,
                                        );
                                        setOpenPopoverIndex(null);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === behavior.name
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {behavior.name}
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
                    name={`behaviors.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Type <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="frequency">Frequency</SelectItem>
                            <SelectItem value="percentage">
                              Percentage
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`behaviors.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter behavior description"
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
                  name={`behaviors.${index}.baseline`}
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

                <div>
                  <FormLabel htmlFor={`topographies-${index}`}>
                    Topographies
                  </FormLabel>
                  <TopographiesField
                    index={index}
                    control={control}
                    register={register}
                    watch={watch}
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

interface TopographiesFieldProps {
  index: number;
  control: any;
  register: any;
  watch: any;
}

function TopographiesField({
  index,
  control,
  register,
  watch,
}: TopographiesFieldProps) {
  const topographies = watch(`behaviors.${index}.topographies`) || [];
  const [newTopography, setNewTopography] = useState("");

  const { append, remove } = useFieldArray({
    control,
    name: `behaviors.${index}.topographies`,
  });

  const handleAddTopography = () => {
    if (newTopography.trim()) {
      append(newTopography.trim());
      setNewTopography("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={newTopography}
          onChange={(e) => setNewTopography(e.target.value)}
          placeholder="Add a topography"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTopography();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAddTopography}
          disabled={!newTopography.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {topographies.map((item: string, i: number) => (
          <div
            key={i}
            className="flex items-center bg-muted rounded-md px-3 py-1 text-sm"
          >
            <span>{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="h-6 w-6 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {topographies.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No topographies added yet.
          </p>
        )}
      </div>
    </div>
  );
}
