"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRole } from "@/lib/utils";
import { api } from "@/trpc/client";
import {
  MailIcon,
  PersonStandingIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import EditProfileDialog from "./_components/EditProfileDialog";
import { useState } from "react";

const ProfileView = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: user } = api.users.getMe.useQuery();

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Card className="md:w-1/2 ">
        <CardContent className="p-5">
          <div className="flex flex-col space-y-8">
            <div className="w-full flex items-center justify-center">
              {user?.profile_path ? (
                <img
                  src={user?.profile_path}
                  alt={"profile"}
                  className="h-[150px] w-[150px] rounded-full"
                />
              ) : (
                <div className="flex">
                  <div className="rounded-full border h-[150px] w-[150px] flex justify-center items-center">
                    <span className="text-lg">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 px-8">
              <div className="flex flex-row w-full items-center justify-start space-x-4">
                <div className="rounded-full bg-gray-200 p-2">
                  <UserIcon className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{user?.name}</p>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-start space-x-4">
                <div className="rounded-full bg-gray-200 p-2">
                  <MailIcon className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-start space-x-4">
                <div className="rounded-full bg-gray-200 p-2">
                  <PhoneIcon className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p>{user?.phone_number ?? "-"}</p>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-start space-x-4">
                <div className="rounded-full bg-gray-200 p-2">
                  <PersonStandingIcon className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p>{formatRole(user?.roles?.name ?? "")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center space-x-3 w-full">
              <Button className="w-full" onClick={()=> setDialogOpen(true)}>Edit Profile</Button>
              <Button className="w-full">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {user && (
        <EditProfileDialog
          dialogOpen={dialogOpen}
          onDialogClose={onDialogClose}
          initialData={{
            id: user?.id,
            name: user?.name,
            phone_number: user?.phone_number,
            profile_path: user?.profile_path,
          }}
        />
      )}
    </div>
  );
};

export default ProfileView;
