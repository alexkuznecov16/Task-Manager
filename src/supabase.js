import { createClient } from "@supabase/supabase-js"
import nProgress from "nprogress"
import "nprogress/nprogress.css"

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKEY = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseURL, supabaseKEY, {
  auth: {
    persistSession: true
  },
  db: {
    schema: "public"
  }
})

export const apiRequest = async (promise) => {
  nProgress.start()
  try {
    const result = await promise
    return result
  } finally {
    nProgress.done()
  }
}
