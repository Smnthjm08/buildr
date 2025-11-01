import { Button } from "@workspace/ui/components/button"
import env from '@workspace/shared/env';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <div>
          {`NODE_ENV: ${env.NODE_ENV} | BACKEND_PORT: ${env.BACKEND_PORT}`}
        </div>
        <Button size="sm">Button</Button>
      </div>
    </div>
  )
}
