import { Button } from "@root/components/Button/Button";
import { Input } from "@root/components/Input/Input";
import Link from "next/link";
import "../app/global.css";

export default function Home() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Hello World</span>
        <Button>
          <span>Click me</span>
        </Button>
        <Input />
        <Link href="/about">About</Link>
      </div>
    </>
  );
}
