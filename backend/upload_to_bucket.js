import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://irqtxxeymkamuwketglk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycXR4eGV5bWthbXV3a2V0Z2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg4MTQsImV4cCI6MjA4OTMxNDgxNH0.UXBpl8kTALL294gOdWUjp40I4gyvbc71dUp2ZvOlMWQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadToBucket() {
  const code = fs.readFileSync('join_predictor_minified.ts', 'utf8');

  const { data, error } = await supabase.storage
    .from('models')
    .upload('join_predictor_edge_function.js', code, {
      contentType: 'application/javascript',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading to bucket:', error);
  } else {
    console.log('Success uploaded to bucket:', data);
  }
}

uploadToBucket();
