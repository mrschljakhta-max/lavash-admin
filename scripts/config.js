window.APP_CONFIG = {
  supabaseUrl: 'https://vfshxogiuaefrgppuypt.supabase.co',
  supabaseAnonKey: 'ТУТ_ТВІЙ_ANON_KEY',

  uploadBucket: 'uploads',
  uploadBatchTable: 'upload_batches',
  uploadedFilesTable: 'uploaded_files',

  edgeWordProcessUrl: 'https://YOUR-PROJECT.supabase.co/functions/v1/process-word-batch',
  edgeExcelProcessUrl: 'https://YOUR-PROJECT.supabase.co/functions/v1/process-excel-batch',
  edgeBatchFinalizeUrl: 'https://YOUR-PROJECT.supabase.co/functions/v1/finalize-upload-batch'
};
