import { supabase } from './supabase'

/**
 * Faz upload de uma foto para o Supabase Storage
 * @param file - arquivo da foto
 * @param itemId - ID do item associado
 * @returns URL da foto ou erro
 */
export async function uploadFoto(file: File, itemId: string): Promise<string> {
  try {
    // Gera um nome único para o arquivo
    const timestamp = Date.now()
    const nomeArquivo = `${itemId}/${timestamp}-${file.name}`

    // Faz upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('fotos-itens')
      .upload(nomeArquivo, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Obtém a URL pública da foto
    const { data: urlData } = supabase.storage
      .from('fotos-itens')
      .getPublicUrl(nomeArquivo)

    // Insere o registro na tabela item_fotos
    const { error: insertError } = await supabase.from('item_fotos').insert([
      {
        item_id: itemId,
        url: urlData.publicUrl,
      },
    ])

    if (insertError) throw insertError

    return urlData.publicUrl
  } catch (err: any) {
    console.error('Erro ao fazer upload de foto:', err?.message || err)
    throw err
  }
}
