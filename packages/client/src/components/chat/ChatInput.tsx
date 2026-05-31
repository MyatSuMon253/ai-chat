import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import type { KeyboardEvent } from 'react';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   return (
      <form
         onSubmit={submit}
         onKeyDown={handleKeyDown}
         className="flex flex-col gap-2 items-end p-4 border-2 rounded-3xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            autoFocus
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={1000}
         />
         <Button
            disabled={!formState.isValid}
            size="icon"
            className="rounded-full"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
