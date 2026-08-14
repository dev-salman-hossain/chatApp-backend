/**
 * Helper function placeholder for custom SMS Gateway
 */
export const sendSms = async (to: string, body: string): Promise<boolean> => {
  console.log(`[SMS Output] To: ${to} | Message: "${body}"`);
  return true;
};
