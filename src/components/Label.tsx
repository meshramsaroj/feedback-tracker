import { Asterisk } from "lucide-react";
import React from "react";
import { FormLabel } from "./ui/form";

const Label = ({ text }: { text: string }) => {
  return (
    <FormLabel className="flex">
      {text} <Asterisk size={12} className="text-red-600" />
    </FormLabel>
  );
};

export default Label;
