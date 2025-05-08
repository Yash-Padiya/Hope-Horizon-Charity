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
import { FileText, HandCoins, ImageIcon, Loader2, Tags, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { eventSchema, EventState } from "@/schema/eventSchema";
import { Label } from "../ui/label";

function UpdateEvent({
  open,
  setOpen,
  setEvents,
  id,
}: {
  open: boolean;
  setOpen: any;
  setEvents: any;
  id: string;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { toast } = useToast();
  const [inputValues, setInput] = useState<EventState>({
    Event_name: "",
    description: "",
    Target_fund: 0,
    coverPhoto: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<EventState>>({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdatedImage, setIsUpdatedImage] = useState(false);
  useEffect(() => {
    setLoading(true);
    setAuthToken(token);
    axiosInstance
      .get(`/api/events/find/${id}`, {
        params: {
          isHighQuality: 0,
        },
      })
      .then((res) => {
        setInput({
          Event_name: res.data.data.Event_name,
          description: res.data.data.description,
          Target_fund: res.data.data.Target_fund,
          coverPhoto: res.data.data.coverPhotoHighQuality,
        });
        setImagePreview(res.data.data.coverPhotoHighQuality);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ Failed to load campaign details at this moment.`,
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
      [name]: name === "Target_fund" ? Number(value) : value,
    });
    setIsUpdated(true);
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setInput({
        ...inputValues,
        coverPhoto: base64String,
      });
    };
    setIsUpdatedImage(true);
    setIsUpdated(true);
  };
  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    const isValidated = eventSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<EventState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setUpdateLoading(true);
      setAuthToken(token);

      axiosInstance
        .put(`api/events/${id}`, inputValues, {
          params: {
            isImageUpdated: isUpdatedImage,
          },
        })
        .then((res) => {
          setEvents((events: any) =>
            events
              .map((event: any) =>
                event._id === res.data.data._id ? res.data.data : event
              )
              .slice(0, 10)
          );
          setOpen(false);
          toast({
            variant: "default",
            title: `✅ ${res.data.message || "Successfully Updated Campaign"}`,
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: `❌ ${
              err.response.data.message || "Failed to Update Campaign"
            }`,
          });
        })
        .finally(() => {
          setUpdateLoading(false);
          setInput({
            Event_name: "",
            description: "",
            Target_fund: 0,
            coverPhoto: "",
          });
          setImagePreview(null);
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
              Update Event
              <DrawerClose>
                <X />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              This action will update the event and is performed by admin.
            </DrawerDescription>
          </DrawerHeader>
          <form className="mx-4" onSubmit={handleUpdate}>
            <div className="flex flex-col gap-y-3 ">
              <div className="relative">
                <Tags className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="text"
                  name="Event_name"
                  placeholder="Event Title"
                  className={`pl-10 ${
                    errors.Event_name
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.Event_name}
                  onChange={handleInput}
                />
                {errors && errors.Event_name && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.Event_name}
                  </h3>
                )}
              </div>
              <div className="relative">
                <FileText className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Textarea
                  name="description"
                  placeholder="Event Description"
                  className={`px-10 ${
                    errors.description
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  rows={3}
                  value={inputValues.description}
                  onChange={handleInput}
                />
                {errors && errors.description && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.description}
                  </h3>
                )}
              </div>
              <div className="relative">
                <HandCoins className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="number"
                  name="Target_fund"
                  placeholder="1000"
                  className={`pl-10 ${
                    errors.Target_fund
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.Target_fund}
                  onChange={handleInput}
                />
                {errors && errors.Target_fund && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.Target_fund}
                  </h3>
                )}
              </div>
              <Label className="font-normal my-1">
                Cover Image of the Campaign
              </Label>
              <div className="relative">
                <ImageIcon className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`pl-10 ${
                    errors.coverPhoto
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                />
                {errors && errors.coverPhoto && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.coverPhoto}
                  </h3>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-40 h-32 rounded-md object-cover"
                  />
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

export default UpdateEvent;
