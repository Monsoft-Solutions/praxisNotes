"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Trash2, Check, ChevronsUpDown, Plus } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Tag } from "./tag";
import { useBehaviors } from "@/hooks/use-behaviors";
import { useInterventions } from "@/hooks/use-interventions";
import { useReplacementPrograms } from "@/hooks/use-replacement-programs";
import { useAntecedents } from "@/hooks/use-antecedents";

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

  // Fetch data from hooks
  const { behaviors } = useBehaviors();
  const { interventions } = useInterventions();
  const { replacementPrograms } = useReplacementPrograms();
  const { antecedents } = useAntecedents();

  // State for dropdown popover
  const [openAntecedentPopover, setOpenAntecedentPopover] = useState(false);
  const [openBehaviorPopover, setOpenBehaviorPopover] = useState(false);
  const [openInterventionPopover, setOpenInterventionPopover] = useState(false);
  const [openReplacementPopover, setOpenReplacementPopover] = useState(false);

  // State for search input in dropdown
  const [antecedentInput, setAntecedentInput] = useState("");
  const [behaviorInput, setBehaviorInput] = useState("");
  const [interventionInput, setInterventionInput] = useState("");
  const [replacementInput, setReplacementInput] = useState("");

  // Handle tag inputs
  const handleTagAdd = (
    type: "behaviors" | "interventions" | "replacementPrograms",
    value: string,
  ) => {
    if (!value.trim()) return;

    const fieldPath = `abcEntries.${index}.${type}`;
    const currentValues = getValues(fieldPath) || [];

    if (!currentValues.includes(value.trim())) {
      const updatedValues = [...currentValues, value.trim()];
      setValue(fieldPath, updatedValues, { shouldValidate: true });
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
              <Popover
                open={openAntecedentPopover}
                onOpenChange={setOpenAntecedentPopover}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      data-trigger
                      onClick={() => setOpenAntecedentPopover(true)}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? field.value
                        : "Select or create an antecedent"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search or create an antecedent..."
                      value={antecedentInput}
                      onValueChange={setAntecedentInput}
                      className="border-none focus:ring-0"
                    />
                    <CommandEmpty>
                      No antecedents found.
                      {antecedentInput.trim() !== "" && (
                        <div className="py-2 px-2">
                          <Button
                            type="button"
                            size="sm"
                            className="w-full mt-2"
                            variant="secondary"
                            onClick={() => {
                              field.onChange(antecedentInput.trim());
                              setAntecedentInput("");
                              setOpenAntecedentPopover(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create "{antecedentInput.trim()}"
                          </Button>
                        </div>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {antecedents
                        .filter(
                          (antecedent) =>
                            !antecedentInput ||
                            antecedent.name
                              .toLowerCase()
                              .includes(antecedentInput.toLowerCase()),
                        )
                        .map((antecedent) => (
                          <CommandItem
                            key={antecedent.id}
                            value={antecedent.name}
                            onSelect={() => {
                              field.onChange(antecedent.name);
                              setAntecedentInput("");
                              setOpenAntecedentPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === antecedent.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {antecedent.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    {antecedentInput.trim() !== "" && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              field.onChange(antecedentInput.trim());
                              setAntecedentInput("");
                              setOpenAntecedentPopover(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create "{antecedentInput.trim()}"
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
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
                <Popover
                  open={openBehaviorPopover}
                  onOpenChange={setOpenBehaviorPopover}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        data-trigger
                        onClick={() => setOpenBehaviorPopover(true)}
                        className="w-full justify-between"
                      >
                        Select or create a behavior
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search or create a behavior..."
                        className="border-none focus:ring-0"
                        value={behaviorInput}
                        onValueChange={setBehaviorInput}
                      />
                      <CommandEmpty>
                        No behaviors found.
                        {behaviorInput.trim() !== "" && (
                          <div className="py-2 px-2">
                            <Button
                              type="button"
                              size="sm"
                              className="w-full mt-2"
                              variant="secondary"
                              onClick={() => {
                                handleTagAdd("behaviors", behaviorInput.trim());
                                setBehaviorInput("");
                                setOpenBehaviorPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{behaviorInput.trim()}"
                            </Button>
                          </div>
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {behaviors &&
                          behaviors
                            .filter(
                              (behavior) =>
                                !behaviorInput ||
                                behavior.name
                                  .toLowerCase()
                                  .includes(behaviorInput.toLowerCase()),
                            )
                            .map((behavior) => (
                              <CommandItem
                                key={behavior.id}
                                value={behavior.name}
                                onSelect={() => {
                                  handleTagAdd("behaviors", behavior.name);
                                  setBehaviorInput("");
                                  setOpenBehaviorPopover(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(behavior.name)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {behavior.name}
                              </CommandItem>
                            ))}
                      </CommandGroup>
                      {behaviorInput.trim() !== "" && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleTagAdd("behaviors", behaviorInput.trim());
                                setBehaviorInput("");
                                setOpenBehaviorPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{behaviorInput.trim()}"
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>

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
                <Popover
                  open={openInterventionPopover}
                  onOpenChange={setOpenInterventionPopover}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        data-trigger
                        onClick={() => setOpenInterventionPopover(true)}
                        className="w-full justify-between"
                      >
                        Select or create an intervention
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search or create an intervention..."
                        className="border-none focus:ring-0"
                        value={interventionInput}
                        onValueChange={setInterventionInput}
                      />
                      <CommandEmpty>
                        No interventions found.
                        {interventionInput.trim() !== "" && (
                          <div className="py-2 px-2">
                            <Button
                              type="button"
                              size="sm"
                              className="w-full mt-2"
                              variant="secondary"
                              onClick={() => {
                                handleTagAdd(
                                  "interventions",
                                  interventionInput.trim(),
                                );
                                setInterventionInput("");
                                setOpenInterventionPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{interventionInput.trim()}"
                            </Button>
                          </div>
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {interventions &&
                          interventions
                            .filter(
                              (intervention) =>
                                !interventionInput ||
                                intervention.name
                                  .toLowerCase()
                                  .includes(interventionInput.toLowerCase()),
                            )
                            .map((intervention) => (
                              <CommandItem
                                key={intervention.id}
                                value={intervention.name}
                                onSelect={() => {
                                  handleTagAdd(
                                    "interventions",
                                    intervention.name,
                                  );
                                  setInterventionInput("");
                                  setOpenInterventionPopover(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(intervention.name)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {intervention.name}
                              </CommandItem>
                            ))}
                      </CommandGroup>
                      {interventionInput.trim() !== "" && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleTagAdd(
                                  "interventions",
                                  interventionInput.trim(),
                                );
                                setInterventionInput("");
                                setOpenInterventionPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{interventionInput.trim()}"
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>

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
                <Popover
                  open={openReplacementPopover}
                  onOpenChange={setOpenReplacementPopover}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        data-trigger
                        onClick={() => setOpenReplacementPopover(true)}
                        className="w-full justify-between"
                      >
                        Select or create a replacement program
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search or create a replacement program..."
                        className="border-none focus:ring-0"
                        value={replacementInput}
                        onValueChange={setReplacementInput}
                      />
                      <CommandEmpty>
                        No replacement programs found.
                        {replacementInput.trim() !== "" && (
                          <div className="py-2 px-2">
                            <Button
                              type="button"
                              size="sm"
                              className="w-full mt-2"
                              variant="secondary"
                              onClick={() => {
                                handleTagAdd(
                                  "replacementPrograms",
                                  replacementInput.trim(),
                                );
                                setReplacementInput("");
                                setOpenReplacementPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{replacementInput.trim()}"
                            </Button>
                          </div>
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {replacementPrograms &&
                          replacementPrograms
                            .filter(
                              (program) =>
                                !replacementInput ||
                                program.name
                                  .toLowerCase()
                                  .includes(replacementInput.toLowerCase()),
                            )
                            .map((program) => (
                              <CommandItem
                                key={program.id}
                                value={program.name}
                                onSelect={() => {
                                  handleTagAdd(
                                    "replacementPrograms",
                                    program.name,
                                  );
                                  setReplacementInput("");
                                  setOpenReplacementPopover(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(program.name)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {program.name}
                              </CommandItem>
                            ))}
                      </CommandGroup>
                      {replacementInput.trim() !== "" && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleTagAdd(
                                  "replacementPrograms",
                                  replacementInput.trim(),
                                );
                                setReplacementInput("");
                                setOpenReplacementPopover(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "{replacementInput.trim()}"
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>

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
