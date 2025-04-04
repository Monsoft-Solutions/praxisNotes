"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { ClientFormValues } from "./validation";

export function ClientReviewSummary() {
  const { watch } = useFormContext<ClientFormValues>();
  const formValues = watch();
  const {
    firstName,
    lastName,
    gender,
    notes,
    behaviors,
    replacementPrograms,
    interventions,
  } = formValues;

  const formatGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      case "other":
        return "Other";
      default:
        return gender;
    }
  };

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Client Information</CardTitle>
          <CardDescription>
            Please review all client information before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p>{firstName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p>{lastName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p>{gender ? formatGender(gender) : "Not provided"}</p>
              </div>
            </div>
            {notes && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p>{notes}</p>
              </div>
            )}
          </section>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="behaviors">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span>Behaviors</span>
                  <Badge className="ml-2" variant="outline">
                    {behaviors.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {behaviors.length === 0 ? (
                  <p className="text-muted-foreground py-2">
                    No behaviors added.
                  </p>
                ) : (
                  <div className="space-y-4 py-2">
                    {behaviors.map((behavior, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{behavior.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {behavior.description || "No description"}
                              </p>
                            </div>
                            <Badge>{formatType(behavior.type)}</Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>Baseline: {behavior.baseline}</p>
                            {behavior.topographies &&
                              behavior.topographies.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-muted-foreground">
                                    Topographies:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {behavior.topographies.map((topo, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {topo}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="replacementPrograms">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span>Replacement Programs</span>
                  <Badge className="ml-2" variant="outline">
                    {replacementPrograms.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {replacementPrograms.length === 0 ? (
                  <p className="text-muted-foreground py-2">
                    No replacement programs added.
                  </p>
                ) : (
                  <div className="space-y-4 py-2">
                    {replacementPrograms.map((program, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{program.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {program.description || "No description"}
                          </p>
                          <div className="mt-2 text-sm">
                            <p>Baseline: {program.baseline}</p>
                            <div className="mt-2">
                              <p className="text-muted-foreground">
                                Associated Behaviors:
                              </p>
                              {program.behaviorIndices.length === 0 ? (
                                <p className="text-sm italic mt-1">
                                  No behaviors associated
                                </p>
                              ) : (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {program.behaviorIndices.map((index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {behaviors[index]?.name ||
                                        `Behavior ${index + 1}`}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="interventions">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span>Interventions</span>
                  <Badge className="ml-2" variant="outline">
                    {interventions.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {interventions.length === 0 ? (
                  <p className="text-muted-foreground py-2">
                    No interventions added.
                  </p>
                ) : (
                  <div className="space-y-4 py-2">
                    {interventions.map((intervention, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{intervention.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {intervention.description || "No description"}
                          </p>
                          <div className="mt-2">
                            <p className="text-muted-foreground">
                              Associated Behaviors:
                            </p>
                            {intervention.behaviorIndices.length === 0 ? (
                              <p className="text-sm italic mt-1">
                                No behaviors associated
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {intervention.behaviorIndices.map((index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {behaviors[index]?.name ||
                                      `Behavior ${index + 1}`}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
