// Supabase 客户端配置
import { createClient } from '@supabase/supabase-js'

// Supabase 项目信息
const supabaseUrl = 'https://dvfwipwswnfhvrsspfej.supabase.co'
const supabaseKey = 'sb_publishable_ynEuQF0r7SXTW4ILBpVVCA_kCY61dW8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase