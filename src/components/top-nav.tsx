"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/client";
import { useRouter } from "next/navigation";

const TopNav = () => {
  const { user } = useSession();
  const navigate = useRouter();

  const { mutateAsync: signOut, isPending } = api.auth.signOut.useMutation();

  const logout = async () => {
    await signOut();
    navigate.refresh();
  };

  const handleProfileClick = async () => {
    navigate.push("/profile");
  };
  return (
    <div className="flex-grow">
      <div className="w-full flex justify-end px-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-row space-x-2 items-center cursor-pointer">
              <Avatar className="border">
                <AvatarImage src={user?.profile_path} alt="@shadcn" />
                <AvatarFallback>
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-sm">{user?.roles?.name}</span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white">
            <div className="space-y-4 divide-y divide-gray-300">
              <button
                className="flex flex-row space-x-2 items-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <Avatar className="border">
                  <AvatarImage src={user?.profile_path} alt="@shadcn" />
                  <AvatarFallback>
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-start">{user?.name}</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
              </button>
              <div className="pt-2">
                <button
                  type="button"
                  className="flex flex-row space-x-2 items-center hover:bg-primary hover:text-white w-full rounded p-2"
                  onClick={logout}
                >
                  {isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <LogOutIcon className="h-4 w-4" />
                  )}

                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TopNav;
