import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://irqtxxeymkamuwketglk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycXR4eGV5bWthbXV3a2V0Z2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg4MTQsImV4cCI6MjA4OTMxNDgxNH0.UXBpl8kTALL294gOdWUjp40I4gyvbc71dUp2ZvOlMWQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadModel() {
  const code = fs.readFileSync('join_predictor_minified.ts', 'utf8');

  // We only need predictJoinScore function, but the file is fully minified and acts like a standalone script that has `predictJoinScore(e)` in scope and ends with `$` (which is a minified function for Deno.serve).
  // Wait, if we eval it, it might define `Deno.serve(...)`. 
  // Let's just store the code.
  
  const { data, error } = await supabase
    .from('ml_models')
    .upsert({ id: 'join-predictor', code, version: 1 });

  if (error) {
    console.error('Error uploading:', error);
  } else {
    console.log('Success uploaded model:', data);
  }
}

uploadModel();
