import { AudioContentModel, audioContentSchema } from "./StaticTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AudioContentFormProps {
  initialData?: AudioContentModel;
  onSave: (values: AudioContentModel) => void;
}

const AudioContentForm = ({ initialData, onSave }: AudioContentFormProps) => {
  const form = useForm<AudioContentModel>({
    resolver: zodResolver(audioContentSchema),
    defaultValues: initialData ?? {
      id: undefined,
      title: "",
      content: "",
      start_time: undefined,
      label: "",
    },
  });
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <div className="flex flex-row items-center w-full space-x-5">
            <div className="space-y-3 flex-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title ( Eng )</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AudioContentForm;