"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newAdminSchema } from "@/trpc/schema/admin.schema";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/client";
import { NewAdminType } from "./StaticTypes";
import { formatRole } from "@/lib/utils";

interface AdministratorFormProps {
  loading?: boolean;
  initialData?: NewAdminType;
  onClickSave: (values: NewAdminType) => void;
  onClose: () => void;
}

const AdministratorForm = ({
  loading = false,
  initialData,
  onClickSave,
  onClose
}: AdministratorFormProps) => {
  const form = useForm<z.infer<typeof newAdminSchema>>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: initialData
      ? initialData
      : {
          email: "",
          name: "",
          role_id: "",
        },
  });

  const { data: roles = [] } = api.roles.getAdminRoles.useQuery();

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onClickSave)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={"email"}
                    disabled={initialData !== undefined}
                    prefix={<Mail className="size-4 text-gray-500" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  defaultValue={field.value.toString()}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {roles.map((role, idx) => (
                      <SelectItem
                        value={role.id.toString()}
                        key={idx}
                        className="hover:bg-gray-100"
                      >
                        {formatRole(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex flex-row space-x-2 justify-end">
            <Button type="button" className="bg-gray-600" onClick={onClose}>
              Cancel
            </Button>
            <Button
              loading={loading}
              type="submit"
              className="text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdministratorForm;
