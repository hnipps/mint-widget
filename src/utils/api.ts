export const getSignature = async (
  address: string,
  quantity: number,
  projectId: string
) => {
  try {
    const signatureResult = await fetch(
      `${process.env.REACT_APP_API_BASE_URI}/signature?account=${address}&quantity=${quantity}&projectId=${projectId}`
    );

    if (signatureResult.status !== 200) {
      throw new Error("Cannot get signature.");
    }

    const { signature } = await signatureResult.json();

    return signature;
  } catch (error) {
    console.error(error);
    return null;
  }
};
