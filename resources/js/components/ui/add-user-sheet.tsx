import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader, 
    SheetTitle
} from "@/components/ui/sheet";

import { useForm } from "@inertiajs/react";
import { DialogProps } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import FormError from "./form-error";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import toast from "react-hot-toast";

type FormType = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    image: File | undefined;
}

const AddUserSheet = ({onOpenChange, ...props}: DialogProps) => {
  
    const {data, setData, post, errors, reset, processing} = useForm<FormType>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        image: undefined,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route("users.store"), {
            onSuccess: () => {
                toast.success("User has been saved successfully");
                reset();
                onOpenChange?.(false);
            }
        })
    }
  
    return (
        <Sheet onOpenChange={onOpenChange} {...props}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create new User</SheetTitle>
                    <SheetDescription />
                </SheetHeader>

                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <Label>Full name</Label>
                        <Input 
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <FormError error={errors.name}/>
                    </div>

                    <div className="space-y-1">
                        <Label>Email Address</Label>
                        <Input 
                            value={data.email}
                            type='email'
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <FormError error={errors.email}/>
                    </div>

                    <div className="space-y-1">
                        <Label>Profile Image</Label>
                        <Input 
                            type='file'
                            onChange={(e) => setData("image", e.target.files?.[0])}
                        />
                        <FormError error={errors.image}/>
                    </div>

                    <div className="space-y-1">
                        <Label>Password</Label>
                        <Input 
                            type='password'
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        <FormError error={errors.password}/>
                    </div>

                    <div className="space-y-1">
                        <Label>Confirm Password</Label>
                        <Input 
                            type='password'
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                        />
                        <FormError error={errors.password_confirmation}/>
                    </div>

                    <Button disabled={processing}>
                        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {!processing ? "Save" : "Saving..."}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default AddUserSheet;