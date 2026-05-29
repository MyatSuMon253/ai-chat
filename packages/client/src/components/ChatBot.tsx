import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';

const ChatBot = () => {
   return (
      <div className="flex flex-col gap-2 items-end p-4 border-2 rounded-3xl">
         <textarea
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={1000}
         />
         <Button size="icon" className="rounded-full">
            <FaArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;
