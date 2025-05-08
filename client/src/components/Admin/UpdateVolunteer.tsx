import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import {
  DockIcon,
  Loader2,
  Mail,
  MapPin,
  PersonStanding,
  Phone,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { VolunteerSchema, VolunteerState } from "@/schema/volunteerSchema";

function UpdateVolunteer({
  open,
  setOpen,
  setVolunteers,
  id,
}: {
  open: boolean;
  setOpen: any;
  setVolunteers: any;
  id: string;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { toast } = useToast();
  const [inputValues, setInput] = useState<VolunteerState>({
    name: "",
    email: "",
    mobile_no: "",
    aadhar_no: "",
    address: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VolunteerState>>({});
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAuthToken(token);
    axiosInstance
      .get(`/api/volunteers/${id}`)
      .then((res) => {
        setInput({
          name: res.data.data.name,
          email: res.data.data.email,
          mobile_no: res.data.data.mobile_no,
          aadhar_no: res.data.data.aadhar_no,
          address: res.data.data.address,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ Failed to update volunteer at this moment.`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({
      ...inputValues,
      [name]: value,
    });
    setIsUpdated(true);
  };
  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    const isValidated = VolunteerSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<VolunteerState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setUpdateLoading(true);
      setAuthToken(token);

      axiosInstance
        .put(`/api/volunteers/${id}`, inputValues)
        .then((res) => {
          setVolunteers((volunteers: any) =>
            volunteers
              .map((volunteer: any) =>
                volunteer._id === res.data.data._id ? res.data.data : volunteer
              )
              .slice(0, 10)
          );
          setOpen(false);
          toast({
            variant: "default",
            title: `✅ ${res.data.message || "Successfully Updated Volunteer"}`,
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: `❌ ${
              err.response.data.message || "Failed to Update Volunteer"
            }`,
          });
        })
        .finally(() => {
          setUpdateLoading(false);
          setInput({
            name: "",
            email: "",
            mobile_no: "",
            aadhar_no: "",
            address: "",
          });
          setOpen(false);
        });
    }
  };
  if (loading) {
    return (
      <div className="w-20 h-20 fixed top-1/2 left-1/2">
        <Loader2 className="animate-spin dark:text-primary" size={45} />
      </div>
    );
  }
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="flex justify-between items-center">
              Add Volunteer
              <DrawerClose>
                <X />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              This action is performed by admin after veryfying the volunteer
              details physically.
            </DrawerDescription>
          </DrawerHeader>
          <form className="mx-4" onSubmit={handleUpdate}>
            <div className="flex flex-col gap-y-3 ">
              <div className="relative">
                <PersonStanding className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={`pl-10 ${
                    errors.name
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.name}
                  onChange={handleInput}
                />
                {errors && errors.name && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.name}
                  </h3>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`pl-10 ${
                    errors.email
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.email}
                  onChange={handleInput}
                />
                {errors && errors?.email && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.email}
                  </h3>
                )}
              </div>

              <div className="relative">
                <Phone className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="tel"
                  name="mobile_no"
                  placeholder="Phone No."
                  className={`pl-10 ${
                    errors.mobile_no
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.mobile_no}
                  onChange={handleInput}
                />
                {errors && errors.mobile_no && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.mobile_no}
                  </h3>
                )}
              </div>
              <div className="relative">
                <MapPin className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Textarea
                  name="address"
                  placeholder="Address"
                  className={`px-10 ${
                    errors.address
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  rows={3}
                  value={inputValues.address}
                  onChange={handleInput}
                />
                {errors && errors.address && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.address}
                  </h3>
                )}
              </div>
              <div className="relative">
                <DockIcon className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="tel"
                  name="aadhar_no"
                  placeholder="Aadhar Card No."
                  className={`pl-10 ${
                    errors.aadhar_no
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.aadhar_no}
                  onChange={handleInput}
                />
                {errors && errors.aadhar_no && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.aadhar_no}
                  </h3>
                )}
              </div>
            </div>
            <DrawerFooter className="px-0">
              {updateLoading ? (
                <Button
                  className="flex gap-x-1 items-center mb-2 w-full"
                  disabled
                >
                  <Loader2 className="animate-spin" size={20} /> Updating....
                </Button>
              ) : (
                <>
                  <Button className="w-full " disabled={!isUpdated}>
                    Update
                  </Button>
                  <Button
                    className="w-full text-black dark:text-white bg-secondary hover:bg-secondary/80"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Discard
                  </Button>
                </>
              )}
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default UpdateVolunteer;
