import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="main-body w-full">
      {/* Adding another div solves shifing of main div due to shadcn select component see also https://github.com/shadcn-ui/ui/issues/977  */}
      <div className="w-full flex-col m-auto main-container px-1 my-4 gap-4 flex relative">
        <App />
      </div>
    </main>
  </React.StrictMode>
)
