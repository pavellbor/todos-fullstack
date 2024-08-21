import { Button } from "@/shared/ui/button";
import { TextInput } from "@/shared/ui/text-input";
import { useState } from "react";
import { useSignIn } from "../model/use-sign-in";

export const SignInForm = () => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const signIn = useSignIn();

  return (
    <form
      className="auth__form"
      onSubmit={(e) => {
        e.preventDefault();
        signIn(formData);
      }}
    >
      <TextInput
        value={formData.username}
        placeholder="username"
        isFocused
        onChange={(username) => setFormData({ ...formData, username })}
      />
      <TextInput
        value={formData.password}
        placeholder="password"
        type="password"
        onChange={(password) => setFormData({ ...formData, password })}
      />
      <Button text="Sign In" isFilled />
    </form>
  );
};
