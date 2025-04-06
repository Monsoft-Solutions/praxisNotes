"use client";

import { useFormContext } from "react-hook-form";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar as CalendarComponent } from "@workspace/ui/components/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { Tag } from "./tag";

export function SessionBasicInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [participantInput, setParticipantInput] = useState("");
  const [environmentalInput, setEnvironmentalInput] = useState("");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[]; onChange: (value: string[]) => void },
    type: "participants" | "environmental",
  ) => {
    const input =
      type === "participants" ? participantInput : environmentalInput;
    const setInput =
      type === "participants" ? setParticipantInput : setEnvironmentalInput;
    const fieldName =
      type === "participants" ? "presentParticipants" : "environmentalChanges";

    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();

      if (!field.value.includes(input.trim())) {
        const updatedValue = [...field.value, input.trim()];
        field.onChange(updatedValue);
      }

      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Date */}
          <FormField
            control={control}
            name="sessionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Session Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter session location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time */}
          <FormField
            control={control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Present Participants */}
        <FormField
          control={control}
          name="presentParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Present Participants</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add participant and press Enter"
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, field, "participants")}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => {
                      if (participantInput.trim()) {
                        if (!field.value.includes(participantInput.trim())) {
                          field.onChange([
                            ...field.value,
                            participantInput.trim(),
                          ]);
                        }
                        setParticipantInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((participant: string, index: number) => (
                      <Tag
                        key={`${participant}-${index}`}
                        text={participant}
                        onRemove={() => {
                          const newParticipants = [...field.value];
                          newParticipants.splice(index, 1);
                          field.onChange(newParticipants);
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

        {/* Environmental Changes */}
        <FormField
          control={control}
          name="environmentalChanges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Environmental Changes</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Add environmental change and press Enter"
                      value={environmentalInput}
                      onChange={(e) => setEnvironmentalInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, field, "environmental")
                      }
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => {
                      if (environmentalInput.trim()) {
                        if (!field.value.includes(environmentalInput.trim())) {
                          field.onChange([
                            ...field.value,
                            environmentalInput.trim(),
                          ]);
                        }
                        setEnvironmentalInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((change: string, index: number) => (
                      <Tag
                        key={`${change}-${index}`}
                        text={change}
                        onRemove={() => {
                          const newChanges = [...field.value];
                          newChanges.splice(index, 1);
                          field.onChange(newChanges);
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
