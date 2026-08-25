/**
 * Utilitário de Geração de Payload PIX Padrão Banco Central do Brasil (EMV / BRCode)
 * Gera o código "Copia e Cola" e QR Code válido com cálculo de CRC16.
 */

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function calculateCRC16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadParams {
  pixKey: string; // Chave PIX (E-mail, CNPJ, Telefone ou Aleatória)
  receiverName: string; // Nome do recebedor (até 25 caracteres)
  city: string; // Cidade (até 15 caracteres)
  amount: number; // Valor (Ex: 420.00)
  transactionId: string; // Identificador da transação (TXID sem caracteres especiais)
  description?: string;
}

export function generatePixBRCode(params: PixPayloadParams): string {
  const cleanKey = params.pixKey.trim();
  const cleanName = params.receiverName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25);
  const cleanCity = params.city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);
  const cleanTxId = (params.transactionId || 'LF' + Date.now().toString().slice(-6)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);
  const formattedAmount = params.amount.toFixed(2);

  // 00: Payload Format Indicator
  let payload = formatField('00', '01');

  // 26: Merchant Account Information
  const merchantAccountInfo = formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', cleanKey);
  payload += formatField('26', merchantAccountInfo);

  // 52: Merchant Category Code
  payload += formatField('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  payload += formatField('53', '986');

  // 54: Transaction Amount
  payload += formatField('54', formattedAmount);

  // 58: Country Code
  payload += formatField('58', 'BR');

  // 59: Merchant Name
  payload += formatField('59', cleanName || 'LOGISTICSFLOW HUB');

  // 60: Merchant City
  payload += formatField('60', cleanCity || 'SAO PAULO');

  // 62: Additional Data Field (TXID)
  const additionalData = formatField('05', cleanTxId);
  payload += formatField('62', additionalData);

  // 63: CRC16 Container
  payload += '6304';
  const crc = calculateCRC16(payload);

  return `${payload}${crc}`;
}
