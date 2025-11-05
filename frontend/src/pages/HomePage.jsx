import { UserButton } from "@clerk/clerk-react";
import { useStreamChat } from "../hooks/useStreamChat.js";

const HomePage = () => {
  return (
    <div>
      <UserButton />
      Home Page
    </div>
  );
};

export default HomePage;
