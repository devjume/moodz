import AsyncStorage from '@react-native-async-storage/async-storage'
import "react-native-url-polyfill/auto";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vewyplxmyqovlpvevbrt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld3lwbHhteXFvdmxwdmV2YnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk5MDYzMDYsImV4cCI6MTk5NTQ4MjMwNn0.ddkqQEigQF8vS0jRIcwhnl_HBOdmrVlRx-YhwKwN3KY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})