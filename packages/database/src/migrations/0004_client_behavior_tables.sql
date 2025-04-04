-- Client Behaviors Table
CREATE TABLE "client_behaviors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"behavior_name" varchar(255) NOT NULL,
	"behavior_description" text,
	"baseline" numeric NOT NULL,
	"type" varchar(50) NOT NULL,
	"topographies" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_behaviors" ADD CONSTRAINT "client_behaviors_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Client Replacement Programs Table
CREATE TABLE "client_replacement_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"program_name" varchar(255) NOT NULL,
	"program_description" text,
	"baseline" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_replacement_programs" ADD CONSTRAINT "client_replacement_programs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Client Replacement Program Behaviors Table (many-to-many)
CREATE TABLE "client_replacement_program_behaviors" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_replacement_program_id" uuid NOT NULL,
	"client_behavior_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "client_replacement_program_behaviors_client_replacement_program_id_client_behavior_id_pk" PRIMARY KEY("client_replacement_program_id","client_behavior_id")
);
--> statement-breakpoint
ALTER TABLE "client_replacement_program_behaviors" ADD CONSTRAINT "client_replacement_program_behaviors_client_replacement_program_id_client_replacement_programs_id_fk" FOREIGN KEY ("client_replacement_program_id") REFERENCES "public"."client_replacement_programs"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "client_replacement_program_behaviors" ADD CONSTRAINT "client_replacement_program_behaviors_client_behavior_id_client_behaviors_id_fk" FOREIGN KEY ("client_behavior_id") REFERENCES "public"."client_behaviors"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Client Interventions Table
CREATE TABLE "client_interventions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"intervention_name" varchar(255) NOT NULL,
	"intervention_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_interventions" ADD CONSTRAINT "client_interventions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Client Intervention Behaviors Table (many-to-many)
CREATE TABLE "client_intervention_behaviors" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_intervention_id" uuid NOT NULL,
	"client_behavior_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "client_intervention_behaviors_client_intervention_id_client_behavior_id_pk" PRIMARY KEY("client_intervention_id","client_behavior_id")
);
--> statement-breakpoint
ALTER TABLE "client_intervention_behaviors" ADD CONSTRAINT "client_intervention_behaviors_client_intervention_id_client_interventions_id_fk" FOREIGN KEY ("client_intervention_id") REFERENCES "public"."client_interventions"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "client_intervention_behaviors" ADD CONSTRAINT "client_intervention_behaviors_client_behavior_id_client_behaviors_id_fk" FOREIGN KEY ("client_behavior_id") REFERENCES "public"."client_behaviors"("id") ON DELETE cascade ON UPDATE no action; 