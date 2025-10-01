"use client";

import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { useEffect } from "react";
import { getUsers } from "../actions/users";

export default function Home() {

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        // setUsers(data);
        console.log("users:", data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="flex items-center min-h-screen justify-center">
      <motion.div
        className="z-20 bg-orange-300 rounded justify-center p-2 items-center flex"
        animate={{
          opacity: 1,
          scale: 1.4,
          transition: { duration: 0.8 },
        }}
      >
        <div>
          <h1>hello this is the bun next.js app</h1>
          <Button>Click me</Button>
        </div>
      </motion.div>
    </div>
  );
}
