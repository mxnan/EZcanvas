/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface TextInputProps {
  id: number;
  text: string;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const TextInput = ({ id, text, onTextChange }: TextInputProps) => {
  const maxCharacters = 50;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= maxCharacters) {
      onTextChange(id, "text", value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`text-${id}`}>Text Content</Label>
      <Input
        id={`text-${id}`}
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Edit Text"
        className="w-full"
      />
      <div className="text-sm text-gray-500">
        {text.length}/{maxCharacters} characters
      </div>
    </div>
  );
}; 