const ALGORITHM = 'AES-CBC';
const IV_LENGTH = 16;

async function getKeyFromPassword(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
  
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('fixed-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: ALGORITHM, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
}
  
export async function decryptData(encryptedData: string): Promise<any> {
    try {
        const key = await getKeyFromPassword(import.meta.env.VITE_ENCRYPTION_KEY);
        // Decodificar base64
        const combined = new Uint8Array(
            atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );

        // Separar IV y datos encriptados
        const iv = combined.slice(0, IV_LENGTH);
        const encrypted = combined.slice(IV_LENGTH);
  
        const decrypted = await crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            encrypted
        );

        // Decodificar y parsear el resultado
        const decoder = new TextDecoder();
        const decodedText = decoder.decode(decrypted);
        return JSON.parse(decodedText);
    } catch (error) {
        console.error('Error en la desencriptación:', error);
        throw new Error('Error en la desencriptación');
    }
}